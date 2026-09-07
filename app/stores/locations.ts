import type { SelectLocationWithLogs } from "~~/server/utils/db/schema";
import { CURRENT_LOCATION_LOG_PAGES, CURRENT_LOCATION_PAGES, LOCATION_PAGES } from "~~/shared/constants";

export const useLocationStore = defineStore("useLocationStore", () => {
  const route = useRoute();

  const {
    data: locations,
    status: locationsStatus,
    refresh: refreshLocations,
  } = useFetch("/api/locations");

  const locationUrlWithSlug = computed(() => `/api/locations/${route.params.slug}`);
  const locationLogUrlWithSlugAndId = computed(() => `/api/locations/${route.params.slug}/${route.params.id}`);

  const {
    data: currentLocation,
    status: currentLocationStatus,
    error: currentLocationError,
    refresh: refreshCurrentLocation,
  } = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
    immediate: false,
    watch: false,
  });

  watch(locationUrlWithSlug, (url) => {
    if (!url.endsWith("undefined"))
      refreshCurrentLocation();
  }, { immediate: true });

  const {
    data: currentLocationLog,
    status: currentLocationLogStatus,
    error: currentLocationLogError,
    refresh: refreshCurrentLocationLog,
  } = useFetch<SelectLocationLog>(locationLogUrlWithSlugAndId, {
    immediate: false,
    watch: false,
  });

  watch(locationLogUrlWithSlugAndId, (url) => {
    if (!url.endsWith("undefined"))
      refreshCurrentLocationLog();
  }, { immediate: true });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (locations.value && LOCATION_PAGES.has(route.name?.toString() ?? "")) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      locations.value.forEach((location) => {
        const mapPoint = createMapPointFromLocation(location);
        sidebarItems.push({
          id: `location-${location.id}`,
          label: location.name,
          icon: "tabler:map-pin-filled",
          to: { name: "dashboard-location-slug", params: { slug: location.slug } },
          mapPoint,
        });
        mapPoints.push(mapPoint);
      });

      sidebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints;
    }
    else if (currentLocation.value && CURRENT_LOCATION_PAGES.has(route.name?.toString() ?? "")) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      const slug = currentLocation.value?.slug;

      currentLocation.value.locationLogs.forEach((log) => {
        const mapPoint = createMapPointFromLocationLog(log, slug);
        sidebarItems.push({
          id: `location-log-${log.id}`,
          label: log.name,
          icon: "tabler:map-pin-filled",
          to: { name: "dashboard-location-slug-id", params: { slug, id: log.id } },
          mapPoint,
        });
        mapPoints.push(mapPoint);
      });

      sidebarStore.sidebarItems = sidebarItems;
      if (mapPoints.length) {
        mapStore.mapPoints = mapPoints;
      }
      else {
        mapStore.mapPoints = [currentLocation.value];
      }
    }
    else if (currentLocationLog.value && CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() ?? "")) {
      mapStore.mapPoints = [currentLocationLog.value];
      sidebarStore.sidebarItems = [];
    }
    sidebarStore.loading = locationsStatus.value === "pending" || currentLocationStatus.value === "pending";
    if (sidebarStore.loading) {
      mapStore.mapPoints = [];
    }
  });

  return {
    locationUrlWithSlug,
    locations,
    locationsStatus,
    refreshLocations,
    currentLocation,
    currentLocationStatus,
    currentLocationError,
    refreshCurrentLocation,
    currentLocationLog,
    currentLocationLogStatus,
    currentLocationLogError,
    refreshCurrentLocationLog,
  };
});

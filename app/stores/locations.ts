import type { SelectLocationWithLogs } from "~~/server/utils/db/schema";

const listLocationsInSidebar = new Set(["dashboard", "dashboard-add"]);
const listCurrentLocationsInSidebar = new Set(["dashboard-location-slug", "dashboard-location-slug-edit", "dashboard-location-slug-add"]);

export const useLocationStore = defineStore("useLocationStore", () => {
  const route = useRoute();

  const {
    data: locations,
    status: locationsStatus,
    refresh: refreshLocations,
  } = useFetch("/api/locations");

  const locationUrlWithSlug = computed(() => `/api/locations/${route.params.slug}`);

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

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (locations.value && listLocationsInSidebar.has(route.name?.toString() ?? "")) {
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
    else if (currentLocation.value && listCurrentLocationsInSidebar.has(route.name?.toString() ?? "")) {
      sidebarStore.sidebarItems = [];
      mapStore.mapPoints = [currentLocation.value];
    }
    sidebarStore.loading = locationsStatus.value === "pending";
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
  };
});

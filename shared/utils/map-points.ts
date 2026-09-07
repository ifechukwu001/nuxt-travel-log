import type { SelectLocation, SelectLocationLog } from "~~/server/utils/db/schema";

export function createMapPointFromLocation(location: SelectLocation): MapPoint {
  return {
    ...location,
    to: { name: "dashboard-location-slug", params: { slug: location.slug } },
    toLabel: "View",

  };
}

export function createMapPointFromLocationLog(locationLog: SelectLocationLog, slug: string): MapPoint {
  return {
    ...locationLog,
    to: { name: "dashboard-location-slug-id", params: { slug, id: locationLog.id } },
    toLabel: "View",

  };
}

export function isPointSelected(item: Pick<MapPoint, "id" | "lat" | "long"> | null | undefined, selectedPoint: MapPoint | null | undefined) {
  if (!item || !selectedPoint)
    return false;

  return item.id === selectedPoint.id
    && item.lat === selectedPoint.lat
    && item.long === selectedPoint.long;
}

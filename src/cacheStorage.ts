let cacheStorage: Cache;

export default async () => {
  if (cacheStorage == null) {
    return (cacheStorage = await caches.open("taittsuu-plus"));
  } else {
    return cacheStorage;
  }
};

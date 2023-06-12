package com.in2.MongoRedis;

import org.springframework.data.geo.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GeoDataService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final MongoTemplate mongoTemplate;

    private final GeoDataRepository geoDataRepository;

    public GeoDataService(RedisTemplate<String, Object> redisTemplate, MongoTemplate mongoTemplate, GeoDataRepository geoDataRepository) {
        this.redisTemplate = redisTemplate;
        this.mongoTemplate = mongoTemplate;
        this.geoDataRepository = geoDataRepository;
    }

    //Löscht alle Daten aus Redis und MongoDB
    public void deleteAll() {
        mongoTemplate.dropCollection("GeoData");
        redisTemplate.getConnectionFactory().getConnection().flushAll();
    }

    public void flush() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();
    }

    //Gibt alle Daten aus MongoDB zurück
    public List<GeoData> findAll() {
        return geoDataRepository.findAll();
    }

    //Speichert die Daten in MongoDB
    public void save(GeoData entity) {
        mongoTemplate.save(entity);
    }

    public void cache() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();
        List<GeoData> points = geoDataRepository.findAll();
        for (GeoData point : points) {
            redisTemplate.opsForGeo().add("GeoData", point.getPoint(), point.getName());
        }
    }

    //Gibt die Daten aus MongoDB zurück
    public GeoData findByName(String name) {
        return geoDataRepository.findById(name).orElse(null);
    }

    //Gibt die Daten aus Redis zurück
    public String getData(String key) {
        return key + (String) redisTemplate.opsForGeo().position("GeoData", key).toString();
    }

    //Gibt die enfernung zwischen zwei punkten zurück
    public Distance getDistance(String key1, String key2) {
        return redisTemplate.opsForGeo().distance("GeoData", key1, key2, Metrics.KILOMETERS);
    }

    public List<String> getNearby(String key, double radius) {
        GeoOperations<String, Object> geoOps = redisTemplate.opsForGeo();
        GeoResults<RedisGeoCommands.GeoLocation<Object>> results = geoOps.radius("GeoData", key, new Distance(radius, Metrics.KILOMETERS));
        List<String> stationNames = new ArrayList<>();
        for (GeoResult<RedisGeoCommands.GeoLocation<Object>> result : results) {
            stationNames.add((String) result.getContent().getName());
        }
        stationNames.remove(key);
        return stationNames;
    }

    public void deleteByName(String name) {
        geoDataRepository.deleteById(name);
    }


}

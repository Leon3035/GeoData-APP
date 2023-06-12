package com.in2.MongoRedis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class GeoDataController {

    private final GeoDataService geoDataService;

    @Autowired
    public GeoDataController(GeoDataService geoDataService) {
        this.geoDataService = geoDataService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<GeoData>> getAllStations() {
        List<GeoData> stations = geoDataService.findAll();
        return ResponseEntity.ok(stations);
    }

    @GetMapping("/{name}")
    public ResponseEntity<GeoData> getStationByName(@PathVariable("name") String name) {
        GeoData station = geoDataService.findByName(name);
        if (station != null) {
            return ResponseEntity.ok(station);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{name}/distance/{otherName}")
    public ResponseEntity<Distance> getDistanceBetweenStations(@PathVariable("name") String name, @PathVariable("otherName") String otherName) {
        Distance distance = geoDataService.getDistance(name, otherName);
        return ResponseEntity.ok(distance);
    }

    @GetMapping("/{name}/nearby/{radius}")
    public ResponseEntity<List<String>> getNearbyStations(@PathVariable("name") String name, @PathVariable("radius") double radius) {
        List<String> nearbyStations = geoDataService.getNearby(name, radius);
        return ResponseEntity.ok(nearbyStations);
    }

    @PostMapping("/save")
    public ResponseEntity<GeoData> saveStation(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        double x = (double) request.get("x");
        double y = (double) request.get("y");

        GeoData station = new GeoData(name, new GeoJsonPoint(x, y));
        geoDataService.save(station);
        return ResponseEntity.ok(station);
    }

    @GetMapping("/cache")
    public ResponseEntity<String> cache() {
        geoDataService.cache();
        return ResponseEntity.ok("Cached");
    }

    @GetMapping("/cache/flush")
    public ResponseEntity<String> flush() {
        geoDataService.flush();
        return ResponseEntity.ok("Flushed");
    }

    @DeleteMapping("/delete/{name}")
    public ResponseEntity<String> deleteStation(@PathVariable("name") String name) {
        geoDataService.deleteByName(name);
        return ResponseEntity.ok("Deleted");
    }

    @PutMapping("/update")
    public ResponseEntity<GeoData> update(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        double x = (double) request.get("x");
        double y = (double) request.get("y");

        geoDataService.deleteByName(name);
        GeoData station = new GeoData(name, new GeoJsonPoint(x, y));
        geoDataService.save(station);
        return ResponseEntity.ok(station);
    }







}

package com.in2.MongoRedis;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

@SpringBootTest
class MongoRedisApplicationTests {
	private final GeoDataService geoService;

	@Autowired
	MongoRedisApplicationTests(GeoDataService geoService) {
		this.geoService = geoService;
	}

	@BeforeEach
	void clear() {
		geoService.deleteAll();
	}

	@Test
	void empty() {
		assert(geoService.findAll().size() == 0);
	}

	@Test
	void fill(){
		geoService.save(new GeoData("Test", new GeoJsonPoint(1, 1)));
		assert(geoService.findAll().size() == 1);
	}

	@Test
	void find(){
		geoService.save(new GeoData("Test", new GeoJsonPoint(1, 1)));
		GeoData point = geoService.findByName("Test");
		assert(point.getName().equals("Test"));
	}

	@Test
	void delete(){
		geoService.save(new GeoData("Test", new GeoJsonPoint(1, 1)));
		geoService.deleteAll();
		assert(geoService.findAll().size() == 0);
	}

	@Test
	void caching(){
		geoService.save(new GeoData("Test", new GeoJsonPoint(1, 1)));
		geoService.cache();
		assertNotEquals("Test[null]", geoService.getData("Test"));
	}

	@Test
	void delteteByName(){
		geoService.save(new GeoData("Test", new GeoJsonPoint(1, 1)));
		geoService.deleteByName("Test");
		assert(geoService.findAll().size() == 0);
	}

}

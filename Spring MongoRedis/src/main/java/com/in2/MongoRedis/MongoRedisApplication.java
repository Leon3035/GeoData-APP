package com.in2.MongoRedis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Component;

@SpringBootApplication
@EnableMongoRepositories
public class MongoRedisApplication {

	public static void main(String[] args) {
		SpringApplication.run(MongoRedisApplication.class, args);
	}

}

@Component
//@Profile("testing")
class PopulateTestDataRunner implements CommandLineRunner {

	private final GeoDataRepository geoRepo;
	private final GeoDataService geoService;

	@Autowired
	public PopulateTestDataRunner(GeoDataRepository geoRepo, GeoDataService geoService) {
		this.geoRepo = geoRepo;
		this.geoService = geoService;
	}

	@Override
	public void run(String... args) {
		ausgabe();


	}

	public void ausgabe(){
		geoService.deleteAll();
		create();
		geoService.cache();
		System.out.println("Beispiel Funktionen.................");
		//System.out.println("All data:");
		//System.out.println(geoService.findAll());
		//System.out.println("Data by name Mongo:");
		//System.out.println(geoService.findByName("HAW Hamburg"));
		//System.out.println("Data by name Redis:");
		//System.out.println(geoService.getData("HAW Hamburg"));
		//System.out.println(geoService.getData("Rathaus"));
		System.out.println("Distance HAW Hamburg and Berliner Tor:");
		System.out.println(geoService.getDistance("HAW Hamburg", "Berliner Tor"));
		System.out.println("Distance HAW Hamburg and Lohmühlenstraße:");
		System.out.println(geoService.getDistance("HAW Hamburg", "Lohmühlenstraße"));
		System.out.println("All Locations within 1km of HAW Hamburg:");
		System.out.println(geoService.getNearby("HAW Hamburg", 1));
		System.out.println("All Locations within 4km of HAW Hamburg:");
		System.out.println(geoService.getNearby("HAW Hamburg", 4));
		geoService.flush();
	}

	public void create(){
		System.out.println("Data creation started...");
		geoService.save(new GeoData("HAW Hamburg", new GeoJsonPoint(53.557078, 10.023109)));
		geoService.save(new GeoData("Rathaus", new GeoJsonPoint(53.550341, 9.992450)));
		geoService.save(new GeoData("Michel", new GeoJsonPoint(53.549562, 9.995115)));
		geoService.save(new GeoData("Hauptbahnhof Nord", new GeoJsonPoint(53.552154, 10.008551)));
		geoService.save(new GeoData("Jungfernstieg", new GeoJsonPoint(53.552819, 9.993669)));
		geoService.save(new GeoData("Landungsbrücken", new GeoJsonPoint(53.545067, 9.969904)));
		geoService.save(new GeoData("Sternschanze", new GeoJsonPoint(53.561106, 9.963829)));
		geoService.save(new GeoData("Berliner Tor", new GeoJsonPoint(53.554446, 10.027901)));
		geoService.save(new GeoData("Hauptbahnhof Süd", new GeoJsonPoint(53.552154, 10.008551)));
		geoService.save(new GeoData("Lohmühlenstraße", new GeoJsonPoint(53.5571, 10.0201)));
		geoService.save(new GeoData("Messehallen", new GeoJsonPoint(53.561106, 9.963829)));
		System.out.println("Data creation complete...");
	}
}

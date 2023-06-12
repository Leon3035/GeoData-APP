package com.in2.MongoRedis;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;


@Document("GeoData")
public class GeoData {
    @Id
    private String name;

    @Field
    private GeoJsonPoint point;

    //@Field
    //private String type;


    public GeoData(String name, GeoJsonPoint point) {
        this.name = name;
        this.point = point;
    }

    @Override
    public String toString() {
        return "{" +
                "name='" + name + '\'' +
                ", latitude='" + point.getX() + '\'' +
                ", longitude='" + point.getY() + '\'' +
                '}';
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public GeoJsonPoint getPoint() {
        return point;
    }

    public void setPoint(GeoJsonPoint point) {
        this.point = point;
    }

    public Double getLatitude() {
        return point.getX();
    }
    public Double getLongitude() {
        return point.getY();
    }

    public void setLatitude(Double latitude) {
        this.point = new GeoJsonPoint(latitude, this.point.getY());
    }

    public void setLongitude(Double longitude) {
        this.point = new GeoJsonPoint(this.point.getX(), longitude);
    }
}

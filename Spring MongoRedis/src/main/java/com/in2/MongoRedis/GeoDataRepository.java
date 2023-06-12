package com.in2.MongoRedis;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

@Repository
public interface GeoDataRepository extends MongoRepository<GeoData, String> {


}

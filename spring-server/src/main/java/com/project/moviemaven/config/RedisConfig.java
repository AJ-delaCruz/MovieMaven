package com.project.moviemaven.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

//for future customization
// @Configuration
public class RedisConfig {
    @Value("${REDIS_HOST}")
    private String redisHost;

    @Value("${REDIS_PORT}")
    private int redisPort;

    // Creating Connection with Redis
    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        // RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        
        return new LettuceConnectionFactory(redisHost, redisPort); // latest client
        // return new JedisConnectionFactory();

    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory());
        return template;
    }

    // @Bean
    // public RedisCacheConfiguration cacheConfiguration() {
    // return RedisCacheConfiguration.defaultCacheConfig()
    // .disableCachingNullValues()
    // .entryTtl(Duration.ofHours(1)) // set TTL for cached data
    // .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new
    // StringRedisSerializer()))
    // .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new
    // GenericJackson2JsonRedisSerializer()));
    // }

}

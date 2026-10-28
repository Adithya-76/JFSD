package com.lexiscan.config;
import org.springframework.boot.context.properties.EnableConfigurationProperties; import org.springframework.context.annotation.*; import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor; import java.util.concurrent.Executor;
@Configuration @EnableConfigurationProperties(AppProperties.class) public class AppConfig { @Bean(name="analysisExecutor") Executor analysisExecutor(){var e=new ThreadPoolTaskExecutor();e.setCorePoolSize(2);e.setMaxPoolSize(4);e.setQueueCapacity(50);e.initialize();return e;} }

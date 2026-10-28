package com.lexiscan;
import org.springframework.boot.SpringApplication; import org.springframework.boot.autoconfigure.SpringBootApplication; import org.springframework.scheduling.annotation.EnableAsync;
@SpringBootApplication @EnableAsync public class LexiScanApplication { public static void main(String[] args){SpringApplication.run(LexiScanApplication.class,args);} }

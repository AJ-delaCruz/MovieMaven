package com.project.moviemaven.model;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {

    @Id
    private ObjectId id;
    private String username;
    private String password;
    private List<ObjectId> watchList = new ArrayList<>();

}

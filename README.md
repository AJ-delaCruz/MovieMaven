# MovieMaven

## System Architecture
<img width="645" alt="System Architecture" src="https://github.com/AJ-delaCruz/MovieMaven/assets/54551895/192db49e-4ad1-4641-a5db-65ea020d6832">

## Technologies Used

### Backend
- [x] Spring Boot (v3.1)
    - [x] Spring Security (v6)
    - [x] JSON Web Token (JWT) for authentication/authorization
    - [x] Spring MVC for web layer
- [x] Java (v17)
- [x] The Movie Database (TMDB) API
    - [x] themoviedbapi (Java wrapper for the TMDB API)

### Frontend
- [x] React (with TypeScript)
    - [x] Context API for state management
- [x] Deployed on Netlify with built-in CI/CD

### Database    
- [x] PostgreSQL
    - [x] Spring Data JPA for data access
- [x] Redis for caching

### Deployment & DevOps
- [x] Docker for containerization
- [x] Jenkins for CI/CD

### Cloud Services
- [ ] AWS
    - [ ] RDS (for PostgreSQL)
    - [ ] ElastiCache (for Redis)
    - [ ] EC2 (for app hosting)

### Testing    
- [ ] Spring Test
    - [ ] Unit Tests
        - [x] Mockito + JUnit 5 for service layer testing
        - [ ] WebMvcTest for controller layer testing
    - [ ] Integration Tests
        - [ ] SpringBootTest
- [x] Postman for API testing

### Performance Testing
- [x] JMeter

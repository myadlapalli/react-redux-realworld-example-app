# myadlapalli
1) Firstly  we have to create a docker image with petclinic and tehe folllowing command are used to achieve that.
it clone https://github.com/spring-projects/spring-petclinic.git
cd spring-petclinic
./mvnw package
java -jar target/*.jar
The successfull installation of the commands would give youa target folder with a .jar file
2) Next we need to create a docker image so create a docker image a docker file is created. As a required java addition is download and we extract the required image from the file by using a script inside the dockerfile and created an docker image after the script.
FROM openjdk:11 this is used as a base image for the project
RUN apt-get update
WORKDIR/target
COPY/spring-petclinic-2.5.0-SNAPSHOT .jar the generated jar file is added to another container to run.
EXPOSE 8080 here the application is exposed to the port with an entry point given.
ENTRYPOINT["java","-jar","spring-petclinic-2.5.0-SNAPSHOT.jar"]
pressing esc and :wq and command docker build -t petclinic will execute the dockerfile.
3) After successful creation of dockerfile a docker image is created and then we have to run the container.
docker run -p 8080:8080 petclinic is used to map to the local host and a successful connection would give you a page with the image.
4) docker build -t petclinic1 anotehr container is created in the same way and mapped to local host 8081 by docker run -p 8081:8080 petclicnic1. This started the application to go to teh web browser and browse the local host 8081.
5)docker inspect -f "{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}" eager_carson
docker inspect -f "{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}" jovial_shirley
with these commands and specifying the container names at the end the IPAddress are found.
6)Now the two containers are pushed to the dockerhub.
docker tag b8db7312de77 3147809/petclinic:kotha
docker push 3147809/petclinic:kotha



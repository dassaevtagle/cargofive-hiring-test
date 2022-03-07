# Cargofive hiring test

This is a test project for the Front-end developer position at Cargofive. You can try the project [here](http://cargofive-ports-table.s3-website.us-east-2.amazonaws.com/).

## Documentation

This table comes with all the basics functionalities which includes:
 1. Sorting elements
 2. Navigate trough paginated data. 
 3. Filter.

Below you can find information about each one.

# Sorting

You can sort elements clicking in the arrow of the column titles (Desktop)
![image](https://user-images.githubusercontent.com/55206760/157015172-334bfa1d-06b5-4722-ac9e-b6fe5dd222dd.png)
or choosing from the dropdown menu (Mobile) ![image](https://user-images.githubusercontent.com/55206760/157015259-aaad3d41-0437-4d74-9099-7ff4d5432e01.png)
. Clicking twice will toggle the order in which elements are sorted by (either ascending or descending).
*Personal comment: Sorting elements I believe should be from all the data availble and not just from one page, but I would rather do this logic in the backend, since doing it with my current resources would be rather slow. The same thing happens with filtering.*

## Navigate

Go to any page in the data.
![image](https://user-images.githubusercontent.com/55206760/157015306-4e0858b8-f20b-4078-bbc0-73f4b3dea3be.png)
Or 
![image](https://user-images.githubusercontent.com/55206760/157015356-572b5080-cac8-48d6-b55e-2a4bcd45f3e8.png)


## Filter by
You can filter as well typing in the search bar. In mobile you should click first on the search icon to display the bar. It will filter the data by id, name, country, continent and coordinates. 
![image](https://user-images.githubusercontent.com/55206760/157015461-bc54529e-8c83-4123-ba3c-613713ca17b9.png)

(Just type whatever you are looking for).
*Personal comment: See in sorting*.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

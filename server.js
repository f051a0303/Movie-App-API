


const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require('dotenv').config();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.port || 8080;



// app.listen(port, ()=>{
//     console.log("Server listening on: " + port);
// })

app.get("/", (req,res)=>{
    res.json({msg:"API Listening"});
})

app.post("/api/movies",(req,res)=>{
    db.addNewMovie(req.body).then((movie)=>{
        res.status(201).json({msg:"New movie is:", movie});
    }).catch((err)=>{
        res.status(404).json(err);
    })
})

app.get("/api/movies", (req,res)=>{
    

    db.getAllMovies(req.query.page,req.query.perPage,req.query.title).then((movies)=>{
        res.status(200).json(movies);

    }).catch((err)=>{
        res.status(404).json(err);
    })

})

app.get("/api/movies/:_id",(req,res)=>{
    db.getMovieById(req.params._id).then((movie)=>{
        res.status(200).json(movie);
    }).catch((err)=>{
        res.status(404).json(err);
    })
})


app.put("/api/movie/:_id",(req,res)=>{
    db.updateMovieById(req.body,req.params._id).then(()=>{
        res.json({msg:"update success"});
    }).catch((err)=>{
        res.status(404).json({msg:"update failed"});
    })
})


app.delete("/api/movies/:_id",(req,res)=>{
    db.deleteMovieById(req.params._id).then(()=>{
        res.json({msg:"deletion success"});
    }).catch((err)=>{
        res.status(404).json({msg:"deletion failed"});
    })
})

//----- Error Page -----
app.use((req,res)=>{
    res.status(404).json({msg:"Error: route is not exist"});
})


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(port, ()=>{
        console.log("Server listening on: " + port);
    })
}).catch((err)=>{
    console.log(err);
})

function removeFromArray(arr, ele)
{
    for(var i = arr.length-1; i >=0; i--)
    {
      if(arr[i] == ele)
      {
          //delete an element from an array
          arr.splice(i, 1);
      }
    }
}

function heuristic(a, b)
{
  //euclidian distance(used for diagonal)
  var e = dist(a.i, a.j, b.i, b.j);
  
  //trying mannhattan distance(concerns more on x and y)
  var d = abs(a.i-b.i)+ abs(a.j-b.j);
  return e;
}

var cols = 30;
var rows = 30;
var grid = new Array(cols);
var current;

var openSet = [];
var closedSet = [];

var start;
var end;
var w, h;
var path = [];

function Spot(i, j)
{
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;
    
    if(random(1) <0.2)
    {
      this.wall = true;
    }
    
    this.show = function(col)
    {
      fill(col);
      if(this.wall)
      {
        fill(0);
      }
        noStroke();
        rect(this.i*w, this.j*h, w-1, h-1);
    };
    
    this.addNeighbors = function(grid)
    {
        var i = this.i;
        var j = this.j;
        if(i <cols-1)
        {
            this.neighbors.push(grid[i+1][j]);
        }
        if(i>0)
        {
            this.neighbors.push(grid[i-1][ j]);
        }
        if(j < rows-1)
        {
            this.neighbors.push(grid[i][ j+1]);
        }
        if(j>0)
        {
            this.neighbors.push(grid[i][ j-1]);
        }
        //diagonally
        if(i>0 && j>0)
        {
            this.neighbors.push(grid[i-1][j-1]);
        }
        if(i<cols-1 && j>0)
        {
            this.neighbors.push(grid[i+1][j-1]);
        }
        if(i>0 && j<rows-1)
        {
            this.neighbors.push(grid[i-1][j+1]);
        }
        if(i<cols-1 && j< rows-1)
        {
            this.neighbors.push(grid[i+1][j+1]);
        }
    };
}
 
function setup() {
     createCanvas(600, 600);
     text('Shubha Vanam', 800, 0);
     console.log("A*");
     
     w = width/cols;
     h = height/rows;
     
     //making a 2D array 
     for(var i  = 0; i < cols; i++)
     {
       grid[i] = new Array(rows);
     }
     for(var a  = 0; a < cols; a++)
     {
       for(var j = 0; j < rows; j++)
       {
         grid[a][j] = new Spot(a, j);
       }
     }
     
     for(var c  = 0; c < cols; c++)
     {
       for(var d = 0; d < rows; d++)
       {
         grid[c][d].addNeighbors(grid);
       }
     }
     
     start = grid[0][0];
     end = grid[cols-1][rows-1];
     start.wall = false;
     end.wall = false;
     
     openSet.push(start);
     
     console.log(grid);
}


function draw() {
    
    if(openSet.length>0)
    {
      var winner = 0;
        for(var r = 0; r < openSet.length; r++)
        {
            if(openSet[r].f < openSet[winner].f)
            {
                winner = r;
            } 
        }
        current = openSet[winner];
        
        if(current === end)
        {
            //find the path
            path = [];
            var temp = current;
            path.push(temp);
            while(temp.previous)
            {
              path.push(temp.previous);
              temp = temp.previous;
            }
          
          
            console.log("Done!");
        }  
        
        removeFromArray(openSet, current);
        closedSet.push(current); 
        
        var neighbors = current.neighbors;
        for(var i = 0; i < neighbors.length; i++)
        {
            var neighbor = neighbors[i];
            
            if(!closedSet.includes(neighbor) && !neighbor.wall)
            {
              var tempG  = current.g+1;
              
              
              var newpath = false;
              if(openSet.includes(neighbor))
              {
                  if(tempG < neighbor.g)
                  {
                    neighbor.g = tempG;
                    newpath = true;
                  }
              }
              else
              {
                neighbor.g = tempG;
                newpath = true;
                 openSet.push(neighbor);
              }
              
              //euclidian 
              if(newpath)
              {
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g+neighbor.h;
                neighbor.previous = current;
              }
              
            }
            
        }
        
    }
    else
    {  
        console.log("no solution");
         noLoop();
        return;
    }
  
    //drawing the grid
    background(0);
    for(var z=0; z < cols; z++)
    {
      for(var j = 0; j < rows; j++)
      {
         grid[z][j].show(color(255));
      }
    }
    for(var a=0; a < closedSet.length; a++)
    {  
       closedSet[a].show(color(248, 131, 121));
    }
    for(var b=0; b < openSet.length; b++)
    {
       openSet[b].show(color(64,224,208));
    }
    for(var c=0; c < path.length; c++)
    {
       path[c].show(color(255,234,97));
       noSmooth();
       point(path[c].i-5, path[c].j-5);
       stroke(0);
       strokeWeight(50);
    }
}

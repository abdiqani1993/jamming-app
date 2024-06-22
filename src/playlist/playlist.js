import React, {useState} from "react";
import SearchBar from "../searchbar/searchBar";

export default function Playlist () {

/* here we have the intianl value of the playlist, we store it useing the state variables 
and the state is updated with setPlaylist2, any new value being added are done by calling the setPlaylist2 
and using the spread operator to copy the previous value and then track is added on top of the previous values*/
const [playlist2, setPlaylist2] = useState(["2Pac: Hit em up", "50Cent: 21 Questionns", "Lil Durk: All my life"]);
const [titleChange, setTitleChange] = useState("Abdi's Playlist");




/* this playlist component is the parent and it passes the prop handleAddTrack to the searchbar component(child component)
once the child component(searchbar) recieves the prop, which is the function below(handleAddTrack),
 the code will be called(from the searchbar component)
track is a a argument here, This function is called from the SearchBar component, where the track is obtained from user input
and passed to playlist component as an argument.
so props enable comunication between both components*/
const handleAddTrack = (track) => {
  
  if (playlist2.includes(track)) {
    alert("Track already exists");
  } else {
    //prev repersents the previous valus i.e playlist2, you can also do setPlaylist2([...playlist2, track]), we do this to not directly
    //access playlist2 so we use a parameter to repersent playlist2
    setPlaylist2(prev => [...prev, track]);
    }
  };

  /*removes tracks from the playlist by copying over playlist 2 and saving it to a variable named remove(using the spread operater)
  we then use the splice method with 2 arguments first is what to remove and second is how many to remove. 
  index is a parameter here i.e a placeholder for a value(argument) to be used when calling this function. The parameter can be named anything
  in remove.splice() index is an argument the value is retrieved during the call of handleRemove func below*/
  const handleRemoveTrack = (indexx) => {
    const remove = [...playlist2];
    remove.splice(indexx, 1);
    setPlaylist2(remove);
  }

  //this edits the title and once the enter button is clicked it updates the title
  const editTitle = (event) => {
    if(event.key === "Enter" ) {
    setTitleChange(event.target.value);
    event.target.value="";
    event.preventDefault();
  }
} 

     

/*below we iterate over playlist2 and save values to a seprate variable named tracks, tracks and index are arguments index repersents
the current index and tracks repersents the values copied from playlist2 and we then return values in a list element  */

/*below we call handleRemoveTrack function in the onclick property we issue a button element to the end of every list element returned 
from mapping through playlist2. and we can use index's value of the list element returned as the argument for handleRemoveTrack
 as its in the same scope  */
    return (
        <div>
          <h1>{titleChange}</h1>
          <label>
            Playlist title:
          <input 
            text="" 
            placeholder="Edit title"
            onChange={(event) => setTitleChange(event.target.value)}
            onKeyDown={editTitle} 
          />

          </label>
          

          <ul>
            
            {playlist2.map((tracks, index) => (<li key={index}>{tracks}
            <button onClick={()=> handleRemoveTrack(index)}>Remove Track</button></li>))}
          </ul>
               
          <SearchBar onAddTrack={handleAddTrack} />
 
        </div>
    )
};
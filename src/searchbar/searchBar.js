import React, { useState } from "react";


export default function SearchBar(props) {
  const [searchTerm, setSearchTerm] = useState("");
 

  //the event handler upodates the values of the input field to the searchTerm state varable 
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //track repersents searchTerm state varuable that has been trim()(white spaces removed) i.e the user input
  //this event handler is called when ever the Add track button is clicked
  const handleAddTrack = () => {
    const track = searchTerm.trim();
    if (track !== "")/*if track is not empty*/ {
      props.onAddTrack(track);//here is where track is called and  passes back to the playlist component
      setSearchTerm(""); // Clear the input field after adding the track
    } else {
      alert("Please enter a valid track name.");//if nothing added to the searchbar
    }
  };



  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Enter track name"
      />
      <button onClick={handleAddTrack}>Add Track</button>
  
    </div>
  );
};


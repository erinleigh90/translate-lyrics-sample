import { useState } from "react";
import { DataStore } from 'aws-amplify';
import { Song } from '../src/models/index';

import styles from '../styles/Home.module.css';

type EditParams = {
  song?: Song,
  handleSuccess: Function
}

export default function EditSong({ song, handleSuccess }: EditParams) {
  const [songTitle, setSongTitle] = useState((song) ? song.title : '');
  const [lyrics, setLyrics] = useState((song) ? song.lyrics : '');

  const handleUserInput = (event: any) => {
    const inputName = event.target.name;

    switch (inputName) {
      case 'title':
        setSongTitle(event.target.value);
        break;
      case 'lyrics':
        setLyrics(event.target.value);
        break;
    }
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {

      if(song) {
        song = await DataStore.save(Song.copyOf(song, updated => {
          updated.title = songTitle;
          updated.lyrics = lyrics;
        }));
      } else {
        song = await DataStore.save(new Song({title: songTitle, lyrics: lyrics}));
        console.log(song);
      }

      handleSuccess(song.id);
    } catch (e: any) {
      console.error(e);
    }
  }

  return (
    <div className={styles.card}>
      <h2>{(song) ? 'Edit Song' : 'New Song'}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputFields}>
          <input type="text" name="title" placeholder="Title" onChange={handleUserInput} value={songTitle} required />
        </div>
        <div className={styles.lyricsParent}>
          <textarea name="lyrics" placeholder="Lyrics" onChange={handleUserInput} value={lyrics} required />
        </div>
        <div>
          <input className={styles.primaryButton} type="submit" name="saveSong" value="Save" />
        </div>
      </form>
    </div>
  );
}
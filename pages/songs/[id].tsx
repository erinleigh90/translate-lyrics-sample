
import { withSSRContext } from 'aws-amplify';
import { useRouter } from 'next/router';
import { Song } from '../../src/models/index';
import { serializeModel } from '@aws-amplify/datastore/ssr';

import SongCard from '../../components/songCard';
import styles from '../../styles/Home.module.css';

export async function getStaticPaths() {
  const SSR = withSSRContext();
  const songs = await SSR.DataStore.query(Song);
  const paths = songs.map((song: any) => ({
    params: { id: song.id }
  }));

  return {
    fallback: true,
    paths
  };
}

export async function getStaticProps({ params }: any) {
  const SSR = withSSRContext();
  
  const song = await SSR.DataStore.query(Song, params.id);

  return {
    props: {
      song: serializeModel(song)
    }
  };
}

export default function SongDetails({ song }: {song: Song}) {
  console.log(song);
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Loading&hellip;</h1>
      </div>
    );
  }

  return (
    <div className={styles.main}><SongCard song={song}></SongCard></div>
  );
}

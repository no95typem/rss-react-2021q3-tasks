import { genUniqId } from '../../lib/generators/generators';
import { DataRecordData } from '../record/record';

export const PRESETS: DataRecordData[] = [
  {
    id: genUniqId(),
    artist: 'Fraunhofer Diffraction',
    title: 'Vice',
    releaseDate: new Date('2014-08-14'),
    imgBase64: './assets/images/preset-wps/Fraunhofer Diffraction-Asphyxia.jpg',
    owned: true,
    rating: 10,
    genre: 'witch-house',
  },
  {
    id: genUniqId(),
    artist: 'brothel.',
    title: 'VEDMAw/ENJOII',
    releaseDate: new Date('2021-01-08'),
    imgBase64: './assets/images/preset-wps/VEDMA.jpg',
    owned: true,
    rating: 10,
    genre: 'dark wave',
  },
  {
    id: genUniqId(),
    artist: 'ΔLLICØRN',
    title: 'DREADCVLT',
    releaseDate: new Date('2020-08-05'),
    imgBase64: './assets/images/preset-wps/dreadcult.jpg',
    owned: true,
    rating: 10,
    genre: 'witch-house',
    pinned: true,
  },
];

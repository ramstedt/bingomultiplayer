'use client';
import BingoCard from './components/BingoCard/BingoCard';
import { useState, useEffect } from 'react';
import { ref, child, get } from 'firebase/database';
import LinkButton from './components/_atoms/LinkButton/LinkButton';

export default function Home() {
  return (
    <>
      <h1>MultiPlayer Bingo </h1>
      <h3>Created by Catface</h3>
      <br />
      <LinkButton text='Create a game' href='/' />
      <br />
      or
      <br />
      <br />
      <LinkButton text='Join a game' href='/' />
      <div className='margin'>
        <br />
        <h2>How to play</h2>
        Join a game by entering the code that was shared to you. You will
        receive a bingo card with boxes in a randomised order. The boxes contain
        texts that the player has created. Fill in your bingo card as you play.
        Once you have a bingo you can announce it to everyone!
      </div>
    </>
  );
}

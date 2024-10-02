const express = require("express");
const axios = require("axios");
const Word = require("../models/Word");
const router = express.Router();

// Fetch a word from Oxford API and save to databse
router.post("/add", async (req, res) => {
  const { word } = req.body;

  try {
    // Check if word already exists in database
    let foundWord = await Word.findOne({ word });
    if (foundWord) {
      return res.status(200).json(foundWord);
    }

    // Fetch word details from Oxford API
    const oxfordResponse = await axios.get(
      `https://od-api-sandbox.oxforddictionaries.com/api/v2/entries/en-gb/${word}`,
      {
        headers: {
          app_id: process.env.OXFORD_APP_ID,
          app_key: process.env.OXFORD_APP_KEY,
        },
      }
    );

    const oxfordData = oxfordResponse.data;
    
    const lexicalCategory =
      oxfordData.results[0].lexicalEntries[0].lexicalCategory.text;
    const definitions =
      oxfordData.results[0].lexicalEntries[0].entries[0].senses.map(
        (sense) => sense.definitions[0]
      );
      
    const phoneticSpelling =
      oxfordData.results[0].lexicalEntries[0].entries[0].pronunciations[0]
        .phoneticSpelling;
    // Save the word to database
    const newWord = new Word({
      word,
      lexicalCategory,
      definitions,
      phoneticSpelling,
    });

    await newWord.save();
    res.status(201).json(newWord);
  } catch (error) {
    
    res.status(500).json({ message: "Error fetching word from Oxford API" });
  }
});

// Get all words from database
router.get("/", async (req, res) => {
  try {
    const words = await Word.find();
    res.status(200).json(words);
  } catch (error) {
    
    res.status(500).json({ message: "Error fetching words" });
  }
});

module.exports = router;

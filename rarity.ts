import {IRaribleSdk} from "@rarible/sdk/build/domain";




async function countRarity(raribleSdk : IRaribleSdk, collectionId : string, oFilePath : string){
    const itemSdk : any = raribleSdk.apis.item;


    let totalAmount : number = 0;
    let continuationStr : string;

    const pageNFT : any = await itemSdk.getItemsByCollection({collection : collectionId, size : 1000});
    let allNFT : any = pageNFT.result;

    totalAmount = totalAmount + pageNFT.result.total;
    continuationStr = pageNFT.result.continuation;


    totalAmount = totalAmount + pageNFT.result.total;
    const timer : any = ms => new Promise(res => setTimeout(res, ms))
    while (pageNFT.hasOwnProperty('continuation')) {            //while it is able to continue we concatenate all information about ALL NFTs in collection in single object
        const pageNFT = await itemSdk.getItemsByCollection({collection : collectionId, continuation : continuationStr, size : 1000});
        allNFT = allNFT.concat(pageNFT.result);
        totalAmount = totalAmount + pageNFT.result.total;
        continuationStr = pageNFT.result.continuation;
        await timer(6000);
    }
    let metadata : any = allNFT.map((e) => JSON.parse(e.metadata).attributes);          // array [0...9999] of {("key1" : "value1"), ("key2", "value2"), ... }  of NFTs' attributes


    let statsCollection : any = {  };


    for (let i = 0; i < metadata.length; i = i + 1) {                                              // ITERATING EACH NFT
        let arrTraits : any = metadata[i].map((e) => e.trait_type);       //array of traits' names
        let arrTraitVals : any = metadata[i].map((e) => e.value);         //array of values' names



        for (let j = 0; j < arrTraits.length; j = j + 1) {      // ITERATING TRAITS OF EACH NFT
            let curTrait : any = arrTraits[j];
            let curValue : any = arrTraitVals[j];
            if (statsCollection[curTrait]) {                //check if there is a field in statsCollection object called after j-th trait (curTrait)
                statsCollection[curTrait].occurancies++;    // if there is we increment the contained meaning "occurancies"
            } else {
                statsCollection[curTrait] = {occurancies : 1};  // if there is no we create a new field in statsCollection with meaning of "occurancies" 1
            }
            if (statsCollection[curTrait][curValue]) {
                statsCollection[curTrait][curValue]++;
            } else {
                statsCollection[curTrait][curValue] = 1;
            }

        }
    }
    for (let i = 0; i < metadata.length; i = i + 1) {                           // COUNT none value occurancies for each trait
        let arrTraits : any = metadata[i].map((e) => e.trait_type);
        if (arrTraits.length < statsCollection.length) {
            let absent : any = Object.keys(statsCollection).filter(
                (e) => !arrTraits.includes(e)
            );
            absent.forEach(trait => {
                if (statsCollection[trait].noneVal) {
                    statsCollection[trait].noneVal++;
                } else {
                    statsCollection[trait].noneVal = 1;
                }
            });
        }
    }


    let arrRarityNFT : any = [];
    //NOW we go through metadata array and create a rarityScore field in each object
    for (let i = 0; i < metadata.length; i = i + 1) {
        let current : any = metadata[i];
        let totalRarity : number = 0;
        for (let j = 0; j < current.length; j = j + 1) {
            current[j].percentage = totalAmount /statsCollection[current[j].trait_type][current[j].value];
        }


        if (current.length < Object.keys(statsCollection)) {            // for each absent trait in current NFT adding this trait with value "noneVal"
                                                                        // also adding field "percentage" to each trait in each NFT
            let absent = Object.keys(statsCollection).filter(
                (e) => !metadata[i].map((f) => f.trait_type).includes(e)
            );
            absent.forEach(trait => {
                current.push ({
                    trait_type : trait,
                    value : "noneVal",
                    percentage : statsCollection[trait].noneVal / totalAmount,
                });
            });
        }
        if (current.length !== statsCollection.length) {
            console.log("Warning: Some traits missing in some NFTs");
        }
        for (let j = 0; j < statsCollection.length; j = j + 1) {            // COUNTING RARITY FUNCTION MAIN THING
            totalRarity = totalRarity + Math.exp(10*(1-current[j].percentage));     // EXPONENTIAL RARITY FUNCTION
        }
        totalRarity = totalRarity / statsCollection.length - 1;


        arrRarityNFT.push({
           attributes : current,
           rarity : totalRarity,
           token_id : allNFT[i].token_id,
           image : allNFT[i].image,
        });

    }
    const fs = require("fs");
    fs.writeFileSync(oFilePath, arrRarityNFT);
}

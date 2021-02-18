//UserInfomation
let userPrivateKey = "5K7nZKGbTCqAFK9x1JdsUGPcjoTm7Yut1acWQAgRcFzpe3bR4JD"//account private key
let userTransfrom = "vwtaytestacc" //account name
//Transfer
let userTransactionact = 'transfer' 
let userTransto = "atomicassets"
let assetIDs = [] //required to be changed number in array can send more than one for unbox
//Unbox
let unboxAcc = "unbox.nft"
let Transmemo = "open pack"
let unBoxAction = "unbox"
let collectionName = "deadmau5" // required to be change for collection name
let TempleteID = 28278//required to be changed

// Api
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch'); //node only
const rpc = new JsonRpc('https://chain.wax.io', { fetch });
const { TextDecoder, TextEncoder } = require('util'); //node only
const privateKeys = [userPrivateKey];
const signatureProvider = new JsSignatureProvider(privateKeys);
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() }); //required to submit transactions

//Timer
let Timer = ()=>{
  year = 2021
  month = 1 // 0 = january, 1= febuary
  day = 20
  hour = 1 // 24 hour system
  minute = 0 // 0 minute for exact execution
  var buy_time = new Date(year,month,day,hour,minute,0,0);
  while (true){
    var time_now = new Date();
    //exit()
    if (time_now.getTime() >= buy_time.getTime()){
      break
    }
  }
}

let Transfer = () => {
    api.transact({
      actions: [{
        account: userTransto,
        name: userTransactionact,
        authorization: [{
          actor: userTransfrom,
          permission: 'active',
        }],
        data: {
            from: userTransfrom,
            to: unboxAcc,
            asset_ids: assetIDs,
            memo : Transmemo
          },
        }]
      }, {
      blocksBehind: 3,
      expireSeconds: 30,
      }).then((res) =>{
        console.log(res)
        console.log('-----------------Transfer Sucess----------------------')
      }).catch((err) =>{ 
          console.log(err)
          console.log('-----------------Transfer Fail----------------------')
          Transfer()
        })
}

let UnBox = () => {
    api.transact({
      actions: [{
        account: unboxAcc,
        name: unBoxAction,
        authorization: [{
          actor: userTransfrom,
          permission: 'active',
        }],
        data: {
            collection_name: collectionName,
            from: userTransfrom,
            box_id: TempleteID,
          },
        }]
      }, {
      blocksBehind: 3,
      expireSeconds: 30,
      }).then((res) =>{
        console.log(res)
        console.log('-----------------Transfer Sucess----------------------')
      }).catch((err) =>{ 
          console.log(err)
          console.log('-----------------Transfer Fail----------------------')
          UnBox()
        })
}

let Main = ()=>{
    Transfer()
    UnBox()
}

Main()
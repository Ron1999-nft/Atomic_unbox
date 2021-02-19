//Transfer
let userTransactionact = 'transfer'
let userTransto = "atomicassets"
//Unbox
let unboxAcc = "unbox.nft"
let Transmemo = "open pack"
let unBoxAction = "unbox"

var fs = require('fs')
//UserInfomation (user need to change) 
fs.readFile('data.txt', (err, data) => {
    if (err) throw err;
    data = data.toString()
    let res = data.split('\r\n')
    let pk = res[0]
    let user = res[1]
    let assid = res[2]
    let col = res[3]
    let tid = res[4]
    let date = res[5]
    let time = res[6]
    pk = pk.split(" :")
    user = user.split(" :")
    assid = assid.split(" :")
    col = col.split(" :")
    tid = tid.split(" :")
    date = date.split(" :")
    time = time.split(" :")
    date = date[1].split('/')
    let year = parseInt(date[2])
    let month = parseInt(date[1]) - 1
    let day = parseInt(date[0])
    time = time[1].split(":")
    let hour = parseInt(time[0])
    let minute = parseInt(time[1])

    let userPrivateKey = pk[1]//account private key
    let userTransfrom = user[1] //account name
    let assetIDs = [parseInt(assid[1])] //required to be changed number in array can send more than one for unbox
    let collectionName = col[1] // required to be change for collection name
    let TempleteID = parseInt(tid[1])//required to be changed

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
    let Timer = () => {
      var buy_time = new Date(year, month, day, hour, minute, 0, 0);
      while (true) {
        var time_now = new Date();
        //exit()
        if (time_now.getTime() >= buy_time.getTime()) {
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
            memo: Transmemo
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      }).then((res) => {
        console.log(res)
        console.log('-----------------Transfer Sucess----------------------')
      }).catch((err) => {
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
      }).then((res) => {
        console.log(res)
        console.log('-----------------Unbox Sucess----------------------')
      }).catch((err) => {
        console.log(err)
        console.log('-----------------Unbox Fail----------------------')
        UnBox()
      })
    }

    let Main = () => {
      Timer()
      Transfer()
      UnBox()
    }

    Main()
  })
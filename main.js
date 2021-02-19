//Transfer
let userTransactionact = 'transfer'
let userTransto = "atomicassets"
//Unbox
let unboxAcc = "unbox.nft"
let unboxMemo = "blek"
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

    let userPrivateKey = pk[1]
    let userTransfrom = user[1] 
    let assetIDs = [parseInt(assid[1])]
    let collectionName = col[1] 
    let TempleteID = parseInt(tid[1])

    // Api
    const { Api, JsonRpc } = require('eosjs');
    const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
    const fetch = require('node-fetch'); //node only
    const rpc = new JsonRpc('https://chain.wax.io', { fetch });
    const { TextDecoder, TextEncoder } = require('util'); //node only
    const privateKeys = [userPrivateKey];
    const signatureProvider = new JsSignatureProvider(privateKeys);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() }); //required to submit transactions

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
            memo: unboxMemo
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      }).then((res) => {
        console.log(res)
        console.log('-----------------Transfer Sucess,Dont Stop the program----------------------')
        Timer2(4000) // in miliseconds
        UnBox()
      }).catch((err) => {
        console.log(err)
        console.log('-----------------Transfer Fail----------------------')
        Transfer()
      })
    }

    //Timer
    let Timer1 = (earlier) => {
      var Trans_time = new Date(year, month, day, hour, minute, 0, 0)
      Trans_time = Trans_time - earlier
      Trans_time = new Date(Trans_time)
      console.log("Pending for assets to be transfer for account : " + userTransfrom + ", assetsID: " + assetIDs)
      console.log('Transfer will start on : ' + Trans_time.getHours() + ':' + Trans_time.getMinutes() + ':' + Trans_time.getSeconds())
      while (true) {
        var time_now = new Date()
        //exit()
        if (time_now.getTime() >= Trans_time.getTime()) {
          break
        }
      }
    }

    let Timer2 = (earlier) => {
      var unbox_time = new Date(year, month, day, hour, minute, 0, 0)
      unbox_time = unbox_time - earlier
      unbox_time = new Date(unbox_time)
      console.log("Pending for unboxing for account : " + userTransfrom + ", assetsID: " + assetIDs)
      console.log('Unbox Time:' +unbox_time.getHours() + ':' + unbox_time.getMinutes() + ':' + unbox_time.getSeconds())
      while (true) {
        var time_now = new Date()
        //exit()
        if (time_now.getTime() >= unbox_time.getTime()) {
          break
        }
      }
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
      Timer1(120000) // in miliseconds
      Transfer()
    }

    Main()
  })
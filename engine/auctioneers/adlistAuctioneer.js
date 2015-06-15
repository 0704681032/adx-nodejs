/**
 * Created by kliu on 12/06/2015.
 */
var util = require("util");
var AuctioneerBase = require("./auctioneerBase");

function AdlistAuctioneer(){

};

util.inherits(AdlistAuctioneer, AuctioneerBase);

AdlistAuctioneer.prototype.auctionType = function(){
    return 1;
};

AdlistAuctioneer.prototype.handle = function(request, responses, engine){
    var self = this;
    var priceFloor = request.adunit.floor;
    var max = request.adunit.param.count;
    var admsCandidate = [];
    responses.forEach(function(response, idx){
        var adms = response.adm.filter(function(adm){
            return adm.price >= priceFloor;
        }).map(function(adm){adm.belongTo = idx; return adm; });
        admsCandidate = admsCandidate.concat(adms);
    });
    var final = admsCandidate.sort(function(left, right){
        return left.price >= right.price ? -1 : 1;
    }).slice(0, max);
    var winner = new Array();
    final.forEach(function (adm){
        if(typeof(responses[adm.belongTo].win) == 'undefined'){
            winner.push(responses[adm.belongTo]);
            responses[adm.belongTo].win = true;
            delete adm.belongTo;
        }
    });
    var loser = responses.filter(function(response){
        return typeof(response.win) == "undefined";
    });
    return [final, winner, loser];
};

AdlistAuctioneer.prototype.supportedVersion = function(){
    return [0.14];
};

module.exports = AdlistAuctioneer;
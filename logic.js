/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global getAssetRegistry getFactory emit */

/**
 * The onsell cargo transaction.
 * @param {org.logistics.CargoOnSell} CargoOnSell
 * @transaction
 */
function onCargoOnSell(CargoOnSell){
    if(CargoOnSell.Seller!=CargoOnSell.Item.owner)
    {
        throw new Error("You don't own this Item!");
    }
    if(CargoOnSell.Item.CargoCondition!="normal")
    {
        throw new Error("This Item is in wrong condition!");
    }
    CargoOnSell.Item.IsOnSell=true;
    return getAssetRegistry('org.logistics.Cargo')
    .then(function (assetRegistry) {
        return assetRegistry.update(CargoOnSell.Item);
    });
  }
/**
 * The sell cargo transaction.
 * @param {org.logistics.BuyCargo} BuyCargo
 * @transaction
 */
async function onBuyCargo(BuyCargo){
    if(BuyCargo.Seller!=BuyCargo.Item.owner)
    {
        throw new Error("Seller don't own this Item!");
    }
    if(BuyCargo.Item.CargoCondition!="normal")
    {
        throw new Error("This Item is in wrong condition!");
    }
  	if(BuyCargo.Item.IsOnSell!=true)
    {
        throw new Error("This Item isn't on sell");
    }
    BuyCargo.Item.CargoCondition="unfilled";
    return getAssetRegistry('org.logistics.Cargo')
    .then(function (assetRegistry) {
       return assetRegistry.update(BuyCargo.Item);
    });
  }
/**
 * The transit cargo transaction.
 * @param {org.logistics.Transit} Transit
 * @transaction
 */
function onTransit(Transit){
    if(Transit.Seller!=Transit.Item.owner)
    {
        throw new Error("Seller don't own this Item!");
    }
    if(Transit.Item.CargoCondition!="unfilled")
    {
        throw new Error("This Item is in wrong condition!");
    }
    Transit.Item.CargoCondition="transit";
    Transit.Item.owner=Transit.Buyer;
    return getAssetRegistry('org.logistics.Cargo')
    .then(function (assetRegistry) {
        return assetRegistry.update(Transit.Item);
    });
  }
/**
 * The arrive cargo transaction.
 * @param {org.logistics.CargoArrive} CargoArrive
 * @transaction
 */
function onCargoArrive(CargoArrive){
    if(CargoArrive.Buyer!=CargoArrive.Item.owner)
    {
        throw new Error("Don't own this Item!");
    }
    if(CargoArrive.Item.CargoCondition!="transit")
    {
        throw new Error("This Item is in wrong condition!");
    }
    CargoArrive.Item.CargoCondition="wait_for_sign";
    return getAssetRegistry('org.logistics.Cargo')
    .then(function (assetRegistry) {
        return assetRegistry.update(CargoArrive.Item);
    });
  }
/**
 * The receive cargo transaction.
 * @param {org.logistics.ReceiveCargo} ReceiveCargo
 * @transaction
 */
function onReceiveCargo(ReceiveCargo){
    if(ReceiveCargo.Buyer!=ReceiveCargo.Item.owner)
    {
        throw new Error("Don't own this Item!");
    }
    if(ReceiveCargo.Item.CargoCondition!="wait_for_sign")
    {
        throw new Error("This Item is in wrong condition!");
    }
    ReceiveCargo.Item.CargoCondition="normal";
  	ReceiveCargo.Item.IsOnSell=false;
    return getAssetRegistry('org.logistics.Cargo')
    .then(function (assetRegistry) {
        return assetRegistry.update(ReceiveCargo.Item);
    });
  }
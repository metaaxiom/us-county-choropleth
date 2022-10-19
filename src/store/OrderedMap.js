/*
1. Assume arr items are objects
2. Assume starting with empty array
*/

class OrderedMap {
    constructor(orderedArr = [], sortBy = {key: '', asc: true}){
        this.orderedArr = orderedArr;
        this.sortBy = sortBy;

        // this.sortKeyIndexes = (this.sortBy.key) ? this.buildSortKeyIndexes() : null;
        this.sortingKeyIdxs = {};
    }

    add(item){
        // find the right place in the array to make insertion
        // months.splice(1, 0, 'Feb');
        // item[this.sortBy.key] // compare this to other items in the array to determine right insertion
        if(this.orderedArr.length == 0){
            this.orderedArr.push(item);
            return;
        }
        
        for(let oaIdx = 0; oaIdx < this.orderedArr.length; oaIdx++){
            if(item[this.sortBy.key] > this.orderedArr[oaIdx][this.sortBy.key]) continue;
            this.orderedArr.splice(oaIdx, 0, item);
            this.sortingKeyIdxs[item[this.sortBy.key]] = oaIdx;
            break;
        }
    }

    // sort(sortBy){
    //     this.orderedArr.sort((itemOne, itemTwo) => {
    //         let fieldOne = (sortBy.key) ? itemOne[sortBy.key] : itemOne;
    //         let fieldTwo = (sortBy.key) ? itemTwo[sortBy.key] : itemTwo;

    //         if(fieldOne < fieldTwo) return (sortBy.asc) ? -1 : 1;
    //         if(fieldOne > fieldTwo) return (sortBy.asc) ? 1 : -1;
    //         return 0;
    //     });
    // }

    // buildSortKeyIndexes(){
    //     let sortKeyIndexesObj = {};
    //     this.orderedArr.forEach((item, itemIdx) => {
    //         sortKeyIndexesObj[item[this.sortBy.key]] = itemIdx;
    //     });
    //     return sortKeyIndexesObj;
    // }
}

export default OrderedMap;
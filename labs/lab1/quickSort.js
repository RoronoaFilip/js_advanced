function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function partition(arr, begin, end) {
    let pivot = arr[end];

    let j = begin - 1;

    for (let i = begin; i < end; ++i) {
        if (arr[i] < pivot) {
            ++j;
            swap(arr, i, j);
        }
    }

    ++j;
    swap(arr, j, end);
    return j;
}

function quickSortRec(arr, begin, end) {

    if (begin < end) {
        let part = partition(arr, begin, end);

        quickSortRec(arr, begin, part - 1);
        quickSortRec(arr, part + 1, end);
    }
}

function quickSort(arr) {
    quickSortRec(arr, 0, arr.length - 1);
}

let arr = [123, 121323, 5345, 345, 2345, 234, 125, 4123, 4];

quickSort(arr);

arr.forEach(a=> console.log(a))
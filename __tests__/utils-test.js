jest.autoMockOff();

require('../utils');


describe('Array', function() {
    describe('transpose', function() {
        it('should transpose 2 by 3 array', function() {
            var array = [
                [1, 2, 3],
                [4, 5, 6]
            ];

            var transposedArray = array.transpose();

            var expectedResult = [
                [1, 4],
                [2, 5],
                [3, 6]
            ];

            expect(transposedArray).toEqual(expectedResult);
        });

        it('should transpose 3 by 2 array', function() {
            var array = [
                [1, 4],
                [2, 5],
                [3, 6]
            ];

            var transposedArray = array.transpose();

            var expectedResult = [
                [1, 2, 3],
                [4, 5, 6]
            ];

            expect(transposedArray).toEqual(expectedResult);
        });

        it('should transpose 3 by 3 array', function() {
            var array = [
                [1, 4, 7],
                [2, 5, 8],
                [3, 6, 9]
            ];

            var transposedArray = array.transpose();

            var expectedResult = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];

            expect(transposedArray).toEqual(expectedResult);
        });


        it('should transpose 1 by 3 array', function() {
            var array = [[1, 4, 7]];

            var transposedArray = array.transpose();

            var expectedResult = [[1], [4], [7]];

            expect(transposedArray).toEqual(expectedResult);
        });
    });

    describe('reject', function() {
        it('should reject if function returns true', function() {
            var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            var res = a.reject(function(i) {
                return i > 5;
            });

            expect(res).toEqual([1, 2, 3, 4, 5]);
        });
    });

    describe('shuffle', function() {
        it('should shuffle array', function() {
            var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            var tries = 100;
            var orig = Object.clone(arr);
            var test = false;

            while(true) {
                arr.shuffle();
                tries--;
                if(arr !== orig){
                    test = true;
                    break;
                } else if (tries == 0) {
                    break;
                }
            }

            expect(test).toEqual(true);
        });
    });
});
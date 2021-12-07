(function() {

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function selectNumber() {
        let digits = [];
        for (let i = 0; i < window.NUMBER_OF_DIGITS; i++) {
            if (i == 0) {
                digits.push(getRandomInt(1, 9));
            } else {
                let randomDigit;
                do {
                    randomDigit = getRandomInt(0, 9);
                } while (digits.includes(randomDigit));
                digits.push(randomDigit);
            }
        }

        return digits;
    }
    window.THE_NUMBER_DIGITS = selectNumber();
    $("body").append(
        $("<div id='easteregg-with-the-number'></div>").prop("title", window.THE_NUMBER_DIGITS.join(''))
    );

    function AddOrRemoveSelectedNumber(num) {
        let exists = false;
        if ($("#chosen-numbers-wrapper .selected-number:contains('"+num+"')").length > 0) {
            $("#chosen-numbers-wrapper .selected-number:contains('"+num+"')").remove();
        } else {
            $("#chosen-numbers-wrapper").append(
                $("<div class='selected-number'>"+num+"</div>")
            );
        }
    }

    function EnableDisableButtons() {
        $("#submit-number-wrapper #check").prop("disabled", $("#chosen-numbers-wrapper .selected-number").length < window.NUMBER_OF_DIGITS);
        $("#submit-number-wrapper #clear").prop("disabled", $("#chosen-numbers-wrapper .selected-number").length == 0);
    }

    $("#numbers-to-choose td").click(function() {
        let $this = $(this);
        const numberInCell = $this.text();

        if (!$this.hasClass("selected")) {

            // check if it reaches max number of digits
            if ($("#numbers-to-choose td.selected").length >= window.NUMBER_OF_DIGITS) {
                return;
            }

            // check that the number doesn't start with 0
            if (numberInCell == 0 && $("#chosen-numbers-wrapper").children().length == 0) {
                return;
            }
        }

        // un/select the digit
        $this.toggleClass("selected");
        AddOrRemoveSelectedNumber(numberInCell);

        EnableDisableButtons();
    });

    // Submit a number to check 
    $("#submit-number-wrapper button#check").click(function() {
        let submittedNumber = $("#chosen-numbers-wrapper .selected-number").text();
        let found = false;

        $(".submitted-numbers-wrapper").each(function(i, obj) {
            let number = $(obj).find(".selected-number").text();
            if (submittedNumber == number) {
                found = true;
            }
        });

        if (found) {
            $("#error-message").text("The number was already submitted");
            return;
        }

        let digits = submittedNumber.split('');
        let matches = 0;
        let exactMatches = 0;
        window.THE_NUMBER_DIGITS.forEach((theNumberDigit, i) => {
            digits.forEach((submittedDigit, j) => {
                if (submittedDigit == theNumberDigit) {
                    if (i == j) {
                        exactMatches++;
                    } else {
                        matches++;
                    }
                }
            })
        });

        if (exactMatches == window.NUMBER_OF_DIGITS) {
            alert("УГАДАЛ!!!");
            window.location.reload();
        } else {
            $("#past-numbers table tbody").prepend(
                $("<tr></tr>")
                    .css("background-color", "#8BE")
                    .animate({backgroundColor: "#FFF"}, 1000)
                    .append(
                        $("<td></td>").append(
                            $("<div class='submitted-numbers-wrapper'></div>").html($("#chosen-numbers-wrapper").html())
                        )
                    )
                    .append($("<td></td>").text(matches))
                    .append($("<td></td>").text(exactMatches))
            )
        }

        $("#submit-number-wrapper button#clear").click();
    });

    $("#submit-number-wrapper button#clear").click(function() {
        $("#chosen-numbers-wrapper").empty();
        $("#error-message").text("");
        $("#numbers-to-choose td").removeClass("selected");

        EnableDisableButtons();
    });

})();
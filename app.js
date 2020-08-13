/////////////////////////////////////////////////////////////
//BudgetCalculator
var budgetCalculator = (function(){

    //Expense Object Constructor
    var Expense = function(ID,description,value){
        this.ID = ID;
        this.description = description;
        this.value = value;
    };
    //Income Object Constructor
    var Income = function(ID,description,value){
        this.ID = ID;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        }
        //,percentage: 0.00
    };

    return {
        addItems: function(type,dis,value){
            var newItem,ID;

            ID=1;
            if(data.allItems[type].length){
                ID = data.allItems[type].length+1;
            }

            if(type==="exp"){
                newItem = new Expense(ID,dis,value);
            }
            else if(type==="inc"){
                newItem = new Income(ID,dis,value);
            }

            data.allItems[type].push(newItem);
            data.total[type]+=parseInt(value);

            //data.percentage = ((((data.total.exp)/data.total.inc).toPrecision(4))*100);

            return newItem;
        }
        //,getData:    data
    };
})();


/////////////////////////////////////////////////////////////
//UI Controller
var uiController = (function(){
    var DOMStrings = {
        stringType: ".add__type",
        stringDescription: ".add__description",
        stringValue: ".add__value",
        stringAddButton: ".add__btn",
        stringExpensesList: ".expenses__list",
        stringIncomeList: ".income__list"
    }
    
    return{
        getInput: function(){
            var inputs= {
                type: document.querySelector(DOMStrings.stringType).value,
                description: document.querySelector(DOMStrings.stringDescription).value,
                value: document.querySelector(DOMStrings.stringValue).value
            }
            return inputs;
        },
        getDOMS: function(){
            return DOMStrings;
        },
        addItemsToUI: function(type,obj){
            var html,element;
            if(type==="exp"){
                element = DOMStrings.stringExpensesList;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%discription%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">---</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type==="inc"){
                element = DOMStrings.stringIncomeList;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%discription%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            html = html.replace('%id%',obj.ID);
            html = html.replace('%discription%',obj.description);
            html = html.replace('%value%',obj.value);
            document.querySelector(element).insertAdjacentHTML("beforeend",html);
        } 
    };
})();

/////////////////////////////////////////////////////////////
//EventHandler
var EventHandler = (function(bgdtcal,uicntrller){
    var DOMS = uicntrller.getDOMS();
    var setupUpEventListener = function(){
        document.querySelector(DOMS.stringAddButton).addEventListener('click',addItem);
        document.addEventListener('keydown',function(e){
            if(e.keyCode===13 || e.which===13){
                addItem();
            }
        });

    };
    
    var addItem = function(){
        var inputs,newItem;

        inputs = uicntrller.getInput();
        if(inputs.description && inputs.value){
            newItem = bgdtcal.addItems(inputs.type,inputs.description,inputs.value);
            document.querySelector(DOMS.stringDescription).value = "";
            document.querySelector(DOMS.stringValue).value = "";
            uicntrller.addItemsToUI(inputs.type,newItem);
        }
    };

    

    return{
        init: function(){
            console.log("Application Has Started.")
            setupUpEventListener();
        }
    };
})(budgetCalculator,uiController);

EventHandler.init();
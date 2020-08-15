/////////////////////////////////////////////////////////////
//BudgetCalculator
var budgetCalculator = (function(){

    //Expense Object Constructor
    var Expense = function(ID,description,value,percentage=0){
        this.ID = ID;
        this.description = description;
        this.value = parseFloat(value);
        this.percentage = percentage;
    };
    //Income Object Constructor
    var Income = function(ID,description,value){
        this.ID = ID;
        this.description = description;
        this.value = parseFloat(value);
    };
    var calculatePercentage = function(){
        data.allItems["exp"].forEach(function(cur,index,arr){
            var percent;
            if(data.total.inc!==0){
                percent = Math.round((cur.value/data.total.inc)*100);
            }
            else{
                percent = 100;
            }

            cur.percentage = percent;
        });
    };

    var calculateBudget = function(type){
        var sum;
        sum=0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.total[type]=sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: 0.00
    };

    return {
        addItems: function(type,dis,value){
            var newItem,ID;

            ID=1;
            if(data.allItems[type].length){
                ID = data.allItems[type][data.allItems[type].length-1].ID+1;
            }

            if(type==="exp"){
                newItem = new Expense(ID,dis,value);
            }
            else if(type==="inc"){
                newItem = new Income(ID,dis,value);
            }

            data.allItems[type].push(newItem);
            //data.total[type]+=parseFloat(value);
            
            //data.percentage = ((((data.total.exp)/data.total.inc).toPrecision(4))*100);

            return newItem;
        },

        deleteItems: function(type,IDs){
            var arrID,arrIndex;
            arrID = data.allItems[type].map(function(cur){
                return cur.ID;
            });
            arrIndex = arrID.indexOf(IDs);
            if(arrIndex!==-1)data.allItems[type].splice(arrIndex,1);
        },
        manageBudget: function(){
            calculateBudget("exp");
            calculateBudget("inc");

            data.budget = data.total.inc - data.total.exp;

            if(data.total.inc){
                data.percentage = Math.round((data.total.exp/data.total.inc)*100);
            }
            else{
                data.percentage = -100.00;
            }
            calculatePercentage();

        },
        getBudget: function(){
            return {
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                totalbugdet: data.budget,
                totalPercentage: data.percentage
            }
        },
        getExpPercentage: function(){
            return data.allItems.exp.map(function(cur){
                return cur.percentage;
            });
        },
        array: data 
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
        stringIncomeList: ".income__list",
        stringMonth: ".budget__title--month",
        stringBudgetIncome: ".budget__income--value",
        stringBudgetExpense: ".budget__expenses--value",
        stringBudgetPercentage: ".budget__expenses--percentage",
        stringBudgetLeft: ".budget__value",
        stringSuperBudgetManagerElement: ".container",
        stringExpensePercentage: ".item__percentage"
    };
    
    var formatting = function(num){
        var num,ints,numCom,res;
        res="";
        num = Math.abs(num);
        num = num.toFixed(2);

        ints = num.split('.');

        numCom = ints[0];
        //console.log(numCom.length);
        for(var i = 0;i<numCom.length;i++){
            if(numCom.length>3 && i<(numCom.length-3) && ((numCom.length%2==0 && (i)%2===0)||(numCom.length%2==1 && (i+1)%2===0))){   
                res+=numCom[i]+",";
            }
            else{
                res+=numCom[i];
            }
        }
        return res+"."+ints[1];
    }

    var Months = {
        0: "January",
        1: "Febuary",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    };

    return{
        toggleRed: function(){
            var nodeList,nodeForEach;
            nodeList = document.querySelectorAll(DOMStrings.stringType+","+DOMStrings.stringDescription+","+DOMStrings.stringValue);

            nodeForEach = function(list,callback){
                for(var i =0;i<list.length;i++){
                    callback(list[i],i);
                }
            };

            nodeForEach(nodeList,function(curr,i){
                curr.classList.toggle("red-focus");
            });

            document.querySelector(DOMStrings.stringAddButton).classList.toggle("red");

        },
        updateMonth: function(){
            var date,month,monthName;
            date =  new Date();
            month = date.getMonth();
            monthName = Months[month];
            document.querySelector(DOMStrings.stringMonth).textContent = monthName;
        },
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
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%discription%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">--%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                html = html.replace('%percentage%',obj.percentage);
            }
            else if(type==="inc"){
                element = DOMStrings.stringIncomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%discription%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            html = html.replace('%id%',obj.ID);
            html = html.replace('%discription%',obj.description);
            html = html.replace('%value%',formatting(obj.value));
            document.querySelector(element).insertAdjacentHTML("beforeend",html);
        },
        removeItemFromUI: function(parent,id){
            //console.log(id);
            document.querySelector("."+parent).removeChild(id);
        },
        clearFields: function(){
            var inputs,fields;
            inputs = document.querySelectorAll(DOMStrings.stringDescription+","+DOMStrings.stringValue);
            fields = Array.prototype.slice.call(inputs);
            //console.log(fields);
            fields.forEach(function(current,index,array){
                current.value = "";
            });
            fields[0].focus();
        },
        updateBudgetDisplay: function(obj){
            document.querySelector(DOMStrings.stringBudgetIncome).textContent = "+"+formatting(obj.totalInc);
            document.querySelector(DOMStrings.stringBudgetExpense).textContent = "-"+formatting(obj.totalExp);
            document.querySelector(DOMStrings.stringBudgetPercentage).textContent= obj.totalPercentage+"%";
            if(obj.totalPercentage==0){
                document.querySelector(DOMStrings.stringBudgetPercentage) .textContent= "--%";
            }
            if(obj.totalbugdet<0){
                document.querySelector(DOMStrings.stringBudgetLeft).textContent = "-"+formatting(obj.totalbugdet);
            }
            else{
                document.querySelector(DOMStrings.stringBudgetLeft).textContent = "+"+formatting(obj.totalbugdet);
            }
            if(obj.totalExp==0){
                document.querySelector(DOMStrings.stringBudgetExpense).textContent = formatting(obj.totalExp);
            }
        },
        updateExpPercentage: function(percentages){
            var nodes = document.querySelectorAll(DOMStrings.stringExpensePercentage);
            var nodesForEach = function(nodes,callback){
                for(var i=0;i<nodes.length;i++){
                    callback(nodes[i],i);
                }
            };
            nodesForEach(nodes,function(curr,ind){
                if(percentages[ind]!==0)curr.textContent = percentages[ind]+"%";
            });
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

        document.querySelector(DOMS.stringSuperBudgetManagerElement).addEventListener('click',deleteItem);

        document.querySelector(DOMS.stringType).addEventListener('change',changeInterface);

    };
    
    var changeInterface = function(){
        uicntrller.toggleRed();
    };

    var updateBudget = function(){
        var budget;
        
        bgdtcal.manageBudget();
        budget = bgdtcal.getBudget();
        uicntrller.updateBudgetDisplay(budget);
    };

    var getExpPercentages = function(){
        var allExpPer;
        allExpPer = bgdtcal.getExpPercentage();
        uicntrller.updateExpPercentage(allExpPer);
    };

    var addItem = function(){
        var inputs,newItem;

        inputs = uicntrller.getInput();
        if(inputs.description && parseFloat(inputs.value)>0){
            newItem = bgdtcal.addItems(inputs.type,inputs.description,inputs.value);
            uicntrller.addItemsToUI(inputs.type,newItem);
            uicntrller.clearFields();
            updateBudget();
            getExpPercentages();
        }
    };

    var deleteItem = function(e){
        var eleParent,eleID,arrEle;
        eleParent = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
        arrEle = e.target.parentNode.parentNode.parentNode.parentNode.id.split("-");
        eleID =  parseInt(arrEle[1]);
        eleType = arrEle[0];
        //console.log(eleParent,eleID);
        bgdtcal.deleteItems(eleType,eleID);
        uicntrller.removeItemFromUI(eleParent.className,e.target.parentNode.parentNode.parentNode.parentNode);
        updateBudget();
        getExpPercentages();
    };

    return{
        init: function(){
            console.log("Application Has Started.")
            setupUpEventListener();
            uicntrller.updateMonth();
            uicntrller.updateBudgetDisplay(
                {
                    totalInc: 0,
                    totalExp: 0,
                    totalbugdet: 0,
                    totalPercentage: 0
                }
            );
        }
    };
})(budgetCalculator,uiController);

EventHandler.init();

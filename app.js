
/**************************MODULE PATTERN JS ************************************/

/*BUDGET CONTROLER*/
var budgetController=(function(){

                //Function constructors for the income and expense
                var Income=function(id,description,value){
                    this.id=id;
                    this.description=description;
                    this.value=value;
                }

                var Expense=function(id,description,value){
                    this.id=id;
                    this.description=description;
                    this.value=value;
                    this.percentage=-1;
                }

              
                    Expense.prototype.calPercentage=function(total_income){
                        if (total_income >0){
                        this.percentage=Math.round((this.value/total_income)*100);
                        }
                        else{
                            this.percentage=-1;
                        }
                };
              
                
                Expense.prototype.getPercentage=function(){
                    return this.percentage;
            };

                //Data structures to maintain the expense and Budget list

                var data={
                    allitems:{
                        exp:[],
                        inc:[]
                    },
                    totals:{
                        exp:0,
                        inc:0
                    },
                    budget:0,
                    percentage:-1
                }
                //calculate totals
                var calculateTotalexpense_income=function(type){
                    var sum=0;
                    data.allitems[type].forEach(function(cur){
                        sum+=cur.value;
                    });
                    data.totals[type]=sum;

                }

                return{

                       

                    addItem:function(type,des,val){

                        var newItem,ID;

                        //Creating ID for the controller
                        if (data.allitems[type].length>0){
                            ID=data.allitems[type][data.allitems[type].length-1].id+1;
                        }else{
                            ID=0;
                        }
                        //Creating the  expense or Income based on the type
                        if(type==='exp'){
                            newItem=new Expense(ID,des,val);
                        }else if(type==='inc'){
                            newItem=new Income(ID,des,val);
                        }

                        //Push the DS items to array
                        data.allitems[type].push(newItem);

                        //return
                        return newItem;
                    },

                    //deleting the item from data structure
                    deleteItem:function(type,id){
                        var ids,index;
                        //find the correcsponding index for the ID
                        ids=data.allitems[type].map(function(current){
                            return current.id;
                        });



                        index = ids.indexOf(id);
                        if(index !== -1){
                            data.allitems[type].splice(index,1);
                        }
                    },


                    calculateBudget:function(){

                        //calculate the total expense and income

                        calculateTotalexpense_income('exp');
                        calculateTotalexpense_income('inc');

                        //calculate budget income - expense
                        data.budget=data.totals.inc-data.totals.exp;
                        //CALCULATE %
                        if (data.totals.inc >0){
                            data.percentage= Math.round((data.totals.exp/data.totals.inc)*100);
                        }else{
                            data.percentage=-1;
                        }
                       
                    },

                    // calling the functions for each array items to get the each item %
                    calculatePercentages:function(){
                        data.allitems.exp.forEach(function(cur){
                            cur.calPercentage(data.totals.inc);
                        });
                    },

                    getPercentages:function(){
                        var allPerc=data.allitems.exp.map(function(cur){
                            return cur.getPercentage();
                        });
                        return allPerc;
                    },

                    //this menthod providing the calculation as object
                    getBudget:function(){
                        return {
                            total_budget:data.budget,
                            total_income:data.totals.inc,
                            total_expense:data.totals.exp,
                            percentage:data.percentage
                        }
                    },
                    TEST:function(){
                        return data;
                      },
                    
                }
})();

/*UI CONTROLER*/
var UIController=(function(){
                //gather all the dom elemnets selection as object
                var DOMstrings={
                    inputType:'.add__type',
                    inputdescription:'.add__description',
                    inputvalues:'.add__value',
                    inputBtn:'.add__btn',
                    incomeClass:'.income__list',
                    expenseList:'.expenses__list',
                    budget_income:'.budget__income--value',
                    expense_amount:'.budget__expenses--value',
                    remaining_total_budget:'.budget__value',
                    expenses_percent:'.budget__expenses--percentage',
                    element_delete:'.container',
                    prcent:'.item__percentage',
                    dateLabel:'.budget__title--month'
                };
                var formatNumber = function(num, type) {
                    var numSplit, int, dec, type;
                    /*
                        + or - before number
                        exactly 2 decimal points
                        comma separating the thousands
            
                        2310.4567 -> + 2,310.46
                        2000 -> + 2,000.00
                        */
            
                    num = Math.abs(num);
                    num = num.toFixed(2);
            
                    numSplit = num.split('.');
            
                    int = numSplit[0];
                    if (int.length > 3) {
                        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
                    }
            
                    dec = numSplit[1];
            
                    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
            
                };

                var nodeListForEach = function(list, callback) {
                    for (var i = 0; i < list.length; i++) {
                        callback(list[i], i);
                    }
                };

                //getting the ui values as object and we are returning that to other methods
            return {
                getInput:function(){
                    return {
                        type: document.querySelector(DOMstrings.inputType).value,
                        description: document.querySelector(DOMstrings.inputdescription).value,
                        value: parseFloat(document.querySelector(DOMstrings.inputvalues).value)
                    };
                },

                //creating the html for the expense and income
                addListitem:function(obj,type){
                   var html,newHtml,element;

                   if(type==='inc'){
                    element=DOMstrings.incomeClass;
                    html='<div class="item clearfix" id="inc-%id"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                   }else if(type==='exp'){
                    element=DOMstrings.expenseList;
                    html='<div class="item clearfix" id="exp-%id"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                   }
                
                 
                     //replacing the strings with actual data
                newHtml=html.replace('%id',obj.id);
                newHtml=newHtml.replace('%des%',obj.description);
                newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));

                //insert the element to the UI
                document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
             
                },
                //removing the income or exepense using the metgod
                deleteListitem:function(selector){

                    var element=document.getElementById(selector);
                    element.parentNode.removeChild(element);

                },

                //clearing the UI fields

                clearFields:function(){
                    var clear_item,clear_item_arr;

                    clear_item=document.querySelectorAll(DOMstrings.inputdescription+','+DOMstrings.inputvalues);
                    //above we will receieve that as list so we have to convert that as a array
                    clear_item_arr=Array.prototype.slice.call(clear_item);

                    clear_item_arr.forEach((current,index,array) => {
                        current.value='';
                    });
                    // to change the focus to description
                    clear_item_arr[0].focus();
                },

                //Updating the budget in top UI screen

                displayBudget:function(obj){
                    var type;
                    obj.total_budget >0 ?type='inc':type='exp';
                    document.querySelector(DOMstrings.budget_income).textContent =formatNumber(obj.total_income,'inc');
                    document.querySelector(DOMstrings.expense_amount).textContent=formatNumber(obj.total_expense,'exp');
                    document.querySelector(DOMstrings.remaining_total_budget).textContent =formatNumber(obj.total_budget,type);

                    //dpnt want the percentage when we have below 0
                    if (obj.percentage > 0){
                        document.querySelector(DOMstrings.expenses_percent).textContent=obj.percentage+'%';
                    }
                    else{
                        document.querySelector(DOMstrings.expenses_percent).textContent='--';
                    }
                    
                
                },
                displayPercent:function(pr){
                    var ele=document.querySelectorAll(DOMstrings.prcent);
                    for(var i=0;i<ele.length;i++){
                        if(pr[i]>0){
                            ele[i].textContent=pr[i]+'%';
                        }else{
                            ele[i].textContent='--';
                        }
                       
                    }

                },
                displayMonth: function() {
                    var now, months, month, year;
                    
                    now = new Date();
                    //var christmas = new Date(2016, 11, 25);
                    
                    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    month = now.getMonth();
                    
                    year = now.getFullYear();
                    document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
                },

                changedType: function() {
            
                    var fields = document.querySelectorAll(
                        DOMstrings.inputType + ',' +
                        DOMstrings.inputdescription + ',' +
                        DOMstrings.inputvalues );
                    
                    nodeListForEach(fields, function(cur) {
                       cur.classList.toggle('red-focus'); 
                    });
                    
                    document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
                    
                },

                
                //returing the dom strings
                getDOMstrings:function(){
                    return DOMstrings;
                }
            };

})();


/*WHOLE APP CONTROLLER*/
var controller=(function(budgetCtrl,UICtrl) {

            var setupEventListeners=function(){

                //receiveing the dom strings here as well so that we can have access to the UI controller

            var DOM=UICtrl.getDOMstrings(); 

                //when user clicks enter key or button then event should trigger to get the values
                document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
                document.addEventListener('keypress',function(ev){
                                if(ev.keyCode===13 || ev.which===13){
                                ctrlAddItem();
                    }
                    });
                document.querySelector(DOM.element_delete).addEventListener('click',ctrlDeleteitem);
                document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);  
            };

            var updateBudget=function(){
                //5.calculate the budget
                budgetCtrl.calculateBudget();

                //6.return the budget
                var Budget=budgetCtrl.getBudget();
                //7.Display the budget
               UICtrl.displayBudget(Budget);

            };

            var updatePercentage=function(){
                //calculate the percentage
                budgetCtrl.calculatePercentages(budgetCtrl.getBudget);
                //get that fro buget ctr

                var precentageofitems=budgetCtrl.getPercentages();


                //update the UI

                
               UICtrl.displayPercent(precentageofitems);

            };

                function ctrlAddItem(){
                    var input,newItem;
                    //1.get inputs from the UI
                    input = UICtrl.getInput();
                    //this if is for make sure we are always entering valid budget info
                    if (input.description !== '' && !isNaN(input.value) && input.value>0)
                    {
                         //2.add items to the budget DS
                    newItem=budgetCtrl.addItem(input.type,input.description,input.value);
                    //3.adding the new item the UI
                   UICtrl.addListitem(newItem,input.type);
                   //4.clearing the UI elemts
                   UICtrl.clearFields();

                   //calling the update budget method

                   updateBudget();


                   //update the percentage

                   updatePercentage();
                    } 
            } 

            function ctrlDeleteitem(event){
                    var ui_item,split_ui_item,type,ID;
                    ui_item=event.target.parentNode.parentNode.parentNode.parentNode.id;
                    
                    if(ui_item){
                        split_ui_item=ui_item.split('-');
                        type=split_ui_item[0];
                        ID=parseInt(split_ui_item[1]);


                        // delete the item form the data strcture
                        budgetCtrl.deleteItem(type,ID);


                        //from UI delete the item
                    UICtrl.deleteListitem(ui_item);

                        //recalculate the budget
                        updateBudget();


                   //update the percentage

                   updatePercentage();
                    }
            }

            //Calling the private members using this object
            return{
                init:function(){
                    setupEventListeners();

                    //Once application started we are making all the values as "0"
                    UICtrl.displayBudget({
                        total_budget:0,
                        total_expense:0,
                        total_income:0,
                        percentage:0
                    });

                   UICtrl.displayMonth();
                }
            }
})(budgetController,UIController);

controller.init();




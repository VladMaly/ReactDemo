import React from 'react'
import { Link } from "react-router-dom";

import Lookup from '../../../modules/Lookup'
import Api from '../../../modules/Api'
import CampaignNavigation from '../CampaignNavigation'
import ListUser from './ListUser'
import ProposeRate from './ProposeRate'
import Format from '../../../modules/utils/Format'
import { isNull } from '../../../../../node_modules/util'
import ModalDialog from '../../shared/modalDialog/ModalDialog'
import Select from 'react-select'
import './CampaignInfluencers.scss';

// props
// - id of campaign

export default class CampaignInfluencers extends React.Component {
    constructor(props, context) {
        super(props, context);

        //this.renderedTriplet = this.renderedTriplet.bind(this);
        this.startPropose = this.startPropose.bind(this);
        this.stopPropose = this.stopPropose.bind(this);
        this.proposeRate = this.proposeRate.bind(this);
        this.startRemove = this.startRemove.bind(this);
        this.removeUsers = this.removeUsers.bind(this);
        this.changeSelectList = this.changeSelectList.bind(this);
        this.recalculateTotalReachCount = this.recalculateTotalReachCount.bind(this);

        this.state = {
            list : [],
            assignments: [],
            selectedStatus: ['ALL'],
            selectedAssignment: ['ALL'] ,
            proposeInProgress: false,
            selectedUser: null,
            removeInProgress : false,
            selectedList: [],
            totalReachCount: 0
        }
    }

    proposeRate(value) {
        let assignmentId=this.state.selectedUser.assignment;
        let userId=this.state.selectedUser.user.user.uid;
        let editUser = this.state.list.find(u=>u.user.id===this.state.selectedUser.user.id);
        Api.proposeRate(assignmentId, userId, value).then((response)=>{
            editUser.user.totalRate = value;
            this.stopPropose();
        }).catch(err => {
            let f = this.props.apiErrFunction;
            if (typeof f === 'function') {
                f(err);
            }
        });
    }

    startPropose(uid) {
        let selectedUser = this.state.list.find(user=>user.user.id === uid);
        this.setState({
            selectedUser: selectedUser,
            proposeInProgress : true
        });
    }

    stopPropose() {
        this.setState({
            selectedUser: null,
            proposeInProgress : false
        });
    }

    startRemove() {
        // console.log(id,title);
         this.setState({ 
            removeInProgress : true 
         });
     }
 
    removeUsers(){
         let userList = this.state.selectedList;
         if (Array.isArray(userList) && userList.length>0) {
             userList.forEach( userId => {
                 let removeUser = this.state.list.find(u => u.user.id === userId);
                 if(!isNull(removeUser) && removeUser.user.status==='PENDING') {
                    removeUser.user.status = 'DECLINED'; 
                    return Api.removeAssignmentUser(removeUser.assignment, removeUser.user.user.uid);
                 }
             });
         }
         this.setState({ removeProgress : false, selectedList: [] });
     }

    changeSelectList(id, flag){
        let slist = this.state.selectedList;
        if (typeof id === 'object') {
            if (id.value === "all") {
                slist = this.state.list.map(influencer => influencer.user.id); 
            }
            if (id.value === "uncheck"){
                slist = [];
            }
        } else {
            if (flag) {
                if (slist.indexOf(id)<0) {
                    slist.push(id);
                } 
            } else {
                let uncheck_index = slist.indexOf(id);
                if (uncheck_index>-1) {
                    slist.splice(uncheck_index, 1);
                } 
            }
        }
        /*if (slist.length>0) {
            this.listContainer.scrollTop = this.listContainer.scrollHeight;
        }*/
        this.recalculateTotalReachCount();
        this.setState({ selectedList: slist });
    }

    handleSelectStatus(value){
        let statusList=value.split(',');
        
        if (statusList.indexOf("ALL")>=0){
            if (this.state.selectedStatus[0] !== 'ALL') {
                statusList = ["ALL"];
            } else if(statusList.length>1){
                let a=statusList.indexOf("ALL");
                statusList.splice(a,1)
            }
        }
        if(value === '' || statusList.length === 4) {
            statusList = ["ALL"];
        }
        this.setState({selectedStatus:statusList, selectedList: []})
    }

    handleSelectAssignments(value){
        if (value.find(function (assignment) {return assignment.value==='ALL'})){
            if (this.state.selectedAssignment[0] !== 'ALL') {
                value = ["ALL"];
            } else if(value.length>1){
                let a=value.findIndex(function (assignment) {return assignment.value==='ALL'});
                value.splice(a,1)
            }
        }
        if(value.length === 0 || value.length === this.state.assignments.length-1) {
            value = ["ALL"];
        }
        this.setState({ selectedAssignment:value, selectedList: [] })
    }

    renderedInfluencer(user, assignmentTitle) {
        let self=this;
         return (
            <div key={user.id} className="influencers">
             { assignmentTitle !== "" && 
               <div className="assignmentTitle">
                  {assignmentTitle}
               </div>  
             }
             <ListUser user={user} checked={self.state.selectedList.indexOf(user.id)>=0} proposeFunction={self.startPropose} selectFunction={self.changeSelectList} />
            </div>
        )
    }

    renderStatus(status, list, percetage) {
        let sType =Lookup.getStatusType(status);
        let scnt = 0;
        let pcnt = 0;
        if (Array.isArray(list) && list.length>0 ) {
            list.forEach( l => { 
                if(l.user.status === status) {
                    scnt++;
                } 
            });
            pcnt = Math.round(Number(scnt/list.length)*100);
        }
        
        return (
            <div className="statusItem" key={sType.label}>
                <div className="label"><img src={sType.img} /> <span>{sType.label}</span> </div>
                <div className="value">{scnt}</div>
                {percetage && <div className="percentage"><div>{pcnt}% {sType.label.toLowerCase()}</div></div>}
            </div>
        )
    }

    recalculateTotalReachCount () {
        let newTotalReachCount = 0;
        const lengthOfList = this.state.list.length;
        for (let i = 0; i < this.state.selectedList.length; i++) {
            for (let t = 0; t < lengthOfList; t++) {
                if (this.state.list[t].user.id == this.state.selectedList[i]) {
                    newTotalReachCount += this.state.list[t].user.totalReach;
                    t = lengthOfList;
                }
            }
        }
        this.setState({ totalReachCount: newTotalReachCount});
    }

    componentDidMount() {
        this.props.setNavigationFunction();
        this.campaignId = this.props.campaignId;
        let self = this;
        Api.getAssignmentList(Number(this.props.campaignId)).then(
            function (data) {
                let res = data.results;
                let list = [];
                let assignments = [{value: 'ALL', label: 'All Assignments'}];
                if (Array.isArray(res) && res.length > 0) {
                    res.forEach( (assignment, ai) => {
                        assignments.push({
                            value: assignment.id,
                            label: assignment.name
                        });
                        if (Array.isArray(assignment.users) && assignment.users.length > 0){
                            assignment.users.forEach(user => { 
                                    list.push( {user: user, assignment: assignment.id});
                            });
                        } 
                        
                    });                    
                }
                self.setState({
                    list : list,
                    assignments: assignments
                })
            }
        ).catch(err => {
            let f = this.props.apiErrFunction;
            if (typeof f === 'function') {
                f(err);
            }
        });
    }

    render() {
        let users = [];
        if (Array.isArray(this.state.list) && this.state.list.length > 0) {
            this.state.list.forEach( user => {
                if (this.state.selectedAssignment[0]==='ALL'|| this.state.selectedAssignment.find(a=>a.value===user.assignment)) {
                    if(this.state.selectedStatus[0]==='ALL'|| this.state.selectedStatus.indexOf(user.user.status)>-1) {
                        users.push(user);
                    }
                }
            }
                
            );
        }
        
       // console.log(users);
        let self=this;
        let influencers=[];
        let totalCost = 0;
        let acceptTotal = 0;
        let selectedTotal = 0;
        if (Array.isArray(users) && users.length > 0) {
            let assignment = '';
            let index = 1;
            users.forEach( user => {
                let aTitle = '';
                if (assignment !== user.assignment) {
                    aTitle =  '#' + index + '-' + self.state.assignments.find(a=>a.value===user.assignment).label;
                    index++;
                }
                influencers.push(self.renderedInfluencer(user.user, aTitle));
                assignment = user.assignment;
            });
            
            totalCost = new Intl.NumberFormat({currency:'CAD'}).format(Number(users.map( user =>  Number(user.user.totalRate) ).reduce((a,b)=>a+b)));
            acceptTotal = new Intl.NumberFormat({currency:'CAD'}).format(Number(users.map( user =>  (user.user.status === 'ACCEPTED')? Number(user.user.totalRate):0 ).reduce((a,b)=>a+b)));
            
            if (this.state.selectedList.length>0){
                selectedTotal = new Intl.NumberFormat({currency:'CAD'}).format(Number(users.map( user =>  {return (this.state.selectedList.indexOf(user.user.id)>=0) ? Number(user.user.totalRate) : 0} ).reduce((a,b)=>a+b)));
            }
        }
        let statuslist = [];
        let statusOptions = [{value: 'ALL', label: 'All status'}];
        Lookup.getStatus().forEach( status => {
            statuslist.push(self.renderStatus(status, users, status==='ACCEPTED'));
            statusOptions.push({value: status, label:Lookup.getStatusType(status).label});
                    } );

        return (
            <div className="campaignInfluencersContainer">
            {this.state.selectedList.length>0 && 
                <ModalDialog
                    show={this.state.removeInProgress}
                    title="Remove from Assignment"
                    proceedButtonLabel="REMOVE"
                    readyToProceed={true}
                    proceedFunction={this.removeUsers}
                    cancelFunction={function() {self.setState({removeInProgress : false});}}
                >
                    <div className="removeUsers">
                        <div className="label">Are you sure you want to remove selected influencers from their assignments?</div>
                    </div>
                </ModalDialog>
            }
                {influencers.length>0 && !isNull(this.state.selectedUser) &&
                    <ProposeRate user={this.state.selectedUser.user}
                        show={this.state.proposeInProgress}
                        cancelFunction={this.stopPropose}
                        proceedFunction={this.proposeRate}
                    />}
                <div className="campaignInfluencers">
                    
                    <div>
                        <div className="influersList">
                            <div className="selector">
                                <div className="select-box">
                                    <div className="label">Assignments:</div>
                                    <Select className="select" clearable={false} value={self.state.selectedAssignment} multi placeholder=""
                                            options={self.state.assignments} onChange={(...args)=>self.handleSelectAssignments(...args)} />
                                </div>
                                <div className="select-box">
                                    <div className="label">Status:</div>
                                    <Select className="select" clearable={false} value={this.state.selectedStatus} multi placeholder=""
                                            onChange={(...args)=>this.handleSelectStatus(...args)} simpleValue={true}
                                            options={statusOptions}/>
                                </div>
                            </div>
                            {(this.state.selectedStatus[0] !== 'ALL' || influencers.length>0) ?
                                <div>
                                    <div className="operation">
                                        <div className="batchAction">
                                            <Select clearable={false} searchable={false}  placeholder="Select"
                                                options = {[{value: "all", label: "All in Page"}, {value: "uncheck", label: "Uncheck"}]}
                                                onChange = {this.changeSelectList}
                                                //clickCount = {this.state.clickCount + this.props.clickCount}
                                            />
                                        </div>
                                        <div className="buttons">
                                            <Link to="/influencers">
                                                + Add Influencers
                                            </Link>
                                        </div>
                                    </div>
                                    {influencers}
                                </div> :
                                <div className="blankInfluencer">
                                    <img src="/images/ic-person.svg" />
                                    You haven't added any influencers
                                    <div className="buttons">
                                        <Link to="/influencers">
                                        FIND INFLUENCERS
                                        </Link>
                                    </div>
                                </div>
                            }
                        </div>
                        <div style={{width: '330px'}}>
                            <div className="influencersStatus">
                                <div className="count">
                                    <div className="label">Total Influencers</div>
                                    <div className="value">{influencers.length}</div>
                                </div>
                                <div className="status">
                                    {statuslist}
                                </div>
                                {/* <div className="cash">
                                    <div className="label">Cash</div>
                                    <div className="value">${totalCash}</div>
                                </div> */}
                                <div className="cost">
                                    <div className="label">Total Amount Contracted</div>
                                    <div className="value">${totalCost}</div>
                                </div>
                                <div className="cost">
                                    <div className="label">Actual Amount To Date</div>
                                    <div className="value">${acceptTotal}</div>
                                </div>
                                {/* <div className="buttons">
                                    <div className="button">EXPORT</div>
                                    <div></div>
                                </div>   */}
                                </div>
                        </div>
                    </div> 
                </div> 
                {this.state.selectedList.length>0 && 
                    <div className="selectedOpration">
                        <div>
                            <div className="selectCount"> 
                                <div>Selected <span>{this.state.selectedList.length}</span></div>
                                <div>Reach <span>{Format.expressInK(this.state.totalReachCount)}</span></div>
                                {/* <div>Cash <span>${selectedTotal}</span></div> */}
                                <div>Total Cost <span>${selectedTotal}</span></div>
                                {/* <div onClick={this.unCheckAll}>Clear All</div> */}
                            </div> 
                            <div className="buttons">
                                <div className="button" onClick={this.startRemove}>Remove Influencer</div>
                            </div>
                        </div> 
                    </div>
                }  
            </div>
        )
        
    }
}

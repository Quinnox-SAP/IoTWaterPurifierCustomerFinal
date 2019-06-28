sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/core/routing/History"
], function (Controller, Filter, History) {
	"use strict";

	return Controller.extend("com.controller.ServiceHistory", {

		onInit: function () {
			this.result = {};
			this.result.items = [];
			this.odataService = new sap.ui.model.odata.ODataModel("/IotWaterPurifier", {
				json: true
			});

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("ServiceHistory").attachMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var that = this;
			that.getView().byId("idSearch").setValue("");
			var aFilters = [];
			var sQuery = "";
			if (sQuery && sQuery.length > 0) {
				//			var filter = new Filter("NotiNumber", sap.ui.model.FilterOperator.Contains, sQuery);
				var filter = [
					new sap.ui.model.Filter("ServiceNumber", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("DateOfCreation", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Comment", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("FaultCodeDesc", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("TechnicianName", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("TechnicianPhone", sap.ui.model.FilterOperator.Contains, sQuery)
				];
				aFilters = new sap.ui.model.Filter(filter, false);
				//	aFilters.push(filter);
			}
			// if (sQuery && sQuery.length > 0) {
			// 	var filter = new Filter("ServiceNumber", sap.ui.model.FilterOperator.Contains, sQuery);
			// 	aFilters.push(filter);
			// }

			// update list binding
			var list = this.byId("idList");
			var binding = list.getBinding("items");
			binding.filter(aFilters);
			var custId = oEvent.getParameter("arguments").customerID;
			var deviceId = oEvent.getParameter("arguments").deviceId;
			this.getView().byId("id1").setText(deviceId);
			this.odataService.read("/ServiceHistorySet?$filter=CustomerID eq '" + custId + "'", null, null, false, function (
				response) {

				that.getOwnerComponent().getModel("oserviceHistory").setData(response);
				that.getOwnerComponent().getModel("oserviceHistory").refresh(true);
				//that.getOwnerComponent().getRouter().navTo("RouteServiceHistory");

			});
		},
		onSearch: function (oEvt) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				//			var filter = new Filter("NotiNumber", sap.ui.model.FilterOperator.Contains, sQuery);
				var filter = [
					new sap.ui.model.Filter("ServiceNumber", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("DateOfCreation", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Comment", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("FaultCodeDesc", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("TechnicianName", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("TechnicianPhone", sap.ui.model.FilterOperator.Contains, sQuery)
				];
				aFilters = new sap.ui.model.Filter(filter, false);
				//	aFilters.push(filter);
			}
			// if (sQuery && sQuery.length > 0) {
			// 	var filter = new Filter("ServiceNumber", sap.ui.model.FilterOperator.Contains, sQuery);
			// 	aFilters.push(filter);
			// }

			// update list binding
			var list = this.byId("idList");
			var binding = list.getBinding("items");
			binding.filter(aFilters);
		},
		// onAfterRendering: function () {
		// 	//DeviceName
		// 	var DeviceName = sap.ui.getCore().deviceId;
		// 	this.getView().byId("id1").setText(DeviceName);
		// },

		// 		_onRouteMatched: function () {
		// //DeviceName
		// // debugger;
		// 	 var DeviceName = sap.ui.getCore().deviceId;
		// 	 this.getView().byId("id1").setText(DeviceName); 
		// 	 //var aData = this.getView().getModel("oserviceHistory");
		// 	 //aData=this.getOwnerComponent().getModel("oserviceHistory").getData();

		// 	 //this.getView().byId("id1").setText("Model1");

		// 	// //FilterType
		// 	// var filterType = sap.ui.getCore().filterType;
		// 	// this.getView().byId("id1").setText(filterType);
		// 	// //WaterFiltered
		// 	// var waterFiltered = sap.ui.getCore().waterFiltered;
		// 	// this.getView().byId("id2").setText(waterFiltered);
		// },

		onNavBack: function () {
			this.getView().byId("idSearch").setValue("");
			var aFilters = [];
			var sQuery = "";
			if (sQuery && sQuery.length > 0) {
				//			var filter = new Filter("NotiNumber", sap.ui.model.FilterOperator.Contains, sQuery);
				var filter = [
					new sap.ui.model.Filter("ServiceNumber", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("DateOfCreation", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Comment", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("FaultCodeDesc", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("TechnicianName", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("TechnicianPhone", sap.ui.model.FilterOperator.Contains, sQuery)
				];
				aFilters = new sap.ui.model.Filter(filter, false);
				//	aFilters.push(filter);
			}
			// if (sQuery && sQuery.length > 0) {
			// 	var filter = new Filter("ServiceNumber", sap.ui.model.FilterOperator.Contains, sQuery);
			// 	aFilters.push(filter);
			// }

			// update list binding
			var list = this.byId("idList");
			var binding = list.getBinding("items");
			binding.filter(aFilters);
			var that = this;
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("Tile");
			}

		},
		onPress: function () {
			var oRef = this;
			var sRouter = sap.ui.core.UIComponent.getRouterFor(oRef);
			sRouter.navTo("RootView", null, true);
			//this.getOwnerComponent().getRouter().navTo("RootView");
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.view.ServiceHistory
		 */
		//	onBeforeRendering: function() {
		//
		//	},

	});

});
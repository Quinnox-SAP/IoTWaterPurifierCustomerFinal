sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function (Controller, MessageBox, History) {
	"use strict";

	return Controller.extend("com.controller.FilterLife", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.view.FilterLife
		 */
		onInit: function () {
			this.result = {};
			this.result.items = [];

			// this.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZQNX_IOT_SRV/", true);

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("FilterLife").attachMatched(this._onObjectMatched, this);

		},

		_onObjectMatched: function (oEvent) {
			//	var that = this;
			//hello
			var filterConsumed = oEvent.getParameter("arguments").FilterConsumed;

			var filterType = oEvent.getParameter("arguments").filterType;
			var waterFiltered = oEvent.getParameter("arguments").waterFiltered;
			this.getView().byId("idList").setNumber(filterConsumed);
			this.getView().byId("id1").setText(filterType);
			var waterfiltered1 = waterFiltered + " " + "litres";
			this.getView().byId("id2").setText(waterfiltered1);

			if (filterConsumed > 80) {
				this.getView().byId("id3").setText("Bad");
				this.getView().byId("id3").setState(sap.ui.core.ValueState.Error);

			} else if (filterConsumed > 50) {
				this.getView().byId("id3").setText("Average");
				this.getView().byId("id3").setState(sap.ui.core.ValueState.Warning);
			} else
				this.getView().byId("id3").setText("Good");
			this.getView().byId("id3").setState(sap.ui.core.ValueState.Success);

		},

		// _onRouteMatched: function () {
		// 	this.getView().byId("idList").setNumber(sap.ui.getCore().filterConsumed);
		// 	//FilterType
		// 	var filterType = sap.ui.getCore().filterType;
		// 	this.getView().byId("id1").setText(filterType);
		// 	//WaterFiltered
		// 	var waterFiltered = sap.ui.getCore().waterFiltered;
		// 	this.getView().byId("id2").setText(waterFiltered);
		// },

		// 		onNavBack: function () {
		// 	window.history.back();
		// 	if (this.getOwnerComponent().isTimedOut) {
		// 		this.getOwnerComponent().showTimeoutMessage();
		// 	}
		// },
		onNavBack: function () {
			//	var that = this;
			// var sPreviousHash = History.getInstance().getPreviousHash();
			// if (sPreviousHash !== undefined) {
			// 	history.go(-1);
			// } else {
			this.getOwnerComponent().getRouter().navTo("Tile");
			// }

			// this.getView().byId("id1").setText("");
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
		 * @memberOf com.view.FilterLife
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.view.FilterLife
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.view.FilterLife
		 */
		//	onExit: function() {
		//
		//	}

	});

});
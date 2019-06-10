sap.ui.define([
	"sap/ui/core/mvc/Controller",
		"sap/ui/iot/elements/IoTEventsOnChartElement",
	"sap/ui/core/routing/History",
], function (Controller,IoTEventsOnChart,History) {
	"use strict";

	return Controller.extend("com.controller.TDSOutput", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.view.TDSOutput
		 */
		onInit: function () {
			this.bRenderChart = true;
			this.bNavMp = false;
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("TDSOutput").attachMatched(this._onRouteMatched, this);
			var oModel = new sap.ui.model.json.JSONModel();
			this.byId("idChart").setModel(oModel, "chartModel");
			
		
		},
		_onRouteMatched: function (oEvent) {
	
				
			//Close the Busy Indicator and retrieve the arguments passed while routing
			// sap.ui.getCore().byId("idBusy").close();
			// sap.ui.getCore().sThingId = oEvent.getParameter("arguments").thingId;
			var sHeaderTitle = oEvent.getParameter("arguments").headerTitle;
			var sSubHeaderTitle = oEvent.getParameter("arguments").subHeaderTitle;
			this.bNavMp = false;
			var oChart = this.byId("idChart");
			oChart.setHeaderTitle(sHeaderTitle);
			oChart.setSubheaderTitle(sSubHeaderTitle);
			var sNavFrom = oEvent.getParameter("arguments").navFrom;
			this.eventsContext = sap.ui.getCore().getModel("eventsModel") && sap.ui.getCore().getModel("eventsModel").getData().eventsData;
			if (sNavFrom === "events" && this.eventsContext) {
				oChart.bNavFromEventList = true;
				oChart.bNavFromMeasuredValue = false;
				this._renderEventsOnChart(oChart, this.eventsContext);
			} else if (sNavFrom === "measuredValues") {
				this.bNavMp = true;
				oChart.setHeaderTitle("");
				oChart.setSubheaderTitle("");
				this.aPath = oEvent.getParameter("arguments").mpPath.split(".");
				oChart.addDefaultPST(this.aPath[0], this.aPath[1]);
				oChart.bChartInit = true;
				oChart.bReload = false;
				oChart.bNavFromMeasuredValue = true;
				oChart.bNavFromEventList = false;
				this._renderChart(oChart, sap.ui.getCore().sThingId);
			} else {
				oChart.bNavFromMeasuredValue = false;
				oChart.bNavFromEventList = false;
				this._renderChart(oChart, sap.ui.getCore().sThingId);
			}
	
		},

		/** Render the events on Chart with the respective Measuring Point as the default PST **/
		_renderEventsOnChart: function (oChart, eventsContext) {
	
		
				oChart.setEventsVisible(true);
			var eventsArr = [];
			if (eventsContext && eventsContext.getPath) {
				var oData = eventsContext.getModel().getProperty(eventsContext.getPath()); //Set this to the this context so that it can be accessible everywhere
				eventsArr.push(oData);
				oChart.getModel("chartModel").setData(eventsArr);
				var aMPPath = oData.Property.split("/");
				oChart.addDefaultPST(aMPPath[1], aMPPath[2]);
				var oTemplate = new IoTEventsOnChart({
					businessTimeStamp: "{chartModel>BusinessTimestamp}",
					severity: "{chartModel>Severity}",
					eventId: "{chartModel>EventId}",
					eventDescription: "{chartModel>Description}",
					eventProperty: "{chartModel>Property}",
					eventStatus: "{chartModel>Status}"
				});
				oChart.bindAggregation("events", "chartModel>/", oTemplate);
			}
			if (!this.bRenderChart) {
				oChart.setAssetId(sap.ui.getCore().sThingId);
			}


		},

		_renderChart: function (oChart, sThingId) {
			// Workaround as of now because onAfterRendering does not get called for the second time
		
			
				if (!this.bRenderChart) {
				oChart.setEventsVisible(false);
				oChart.setAssetId(sap.ui.getCore().sThingId);
			}
		},

		onAfterRendering: function () {
				if (this.bRenderChart) {
				var oChart = this.byId("idChart");
				this.bRenderChart = false;
				if (this.eventsContext) {
					oChart.setEventsVisible(true);
				} else {
					oChart.setEventsVisible(false);
				}
				oChart.setAssetId(sap.ui.getCore().sThingId);
			}
		
		},

		handleNavBackPress: function () {
			window.history.back();
			if (this.getOwnerComponent().isTimedOut) {
				this.getOwnerComponent().showTimeoutMessage();
			}
		},
		onPressBack: function () {
			var that = this;
			// that.getOwnerComponent().getRouter().navTo("WaterQuality");
			var sHistory = History.getInstance();
			var sPreviousHash = sHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			}
		},
	
			onPress:function(){
			this.getOwnerComponent().getRouter().navTo("Main");
		}


		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.view.TDSOutput
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.view.TDSOutput
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.view.TDSOutput
		 */
		//	onExit: function() {
		//
		//	}

	});

});
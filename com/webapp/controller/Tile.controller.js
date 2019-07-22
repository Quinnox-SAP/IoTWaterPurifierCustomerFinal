sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function (Controller, MessageBox, History) {
	"use strict";

	return Controller.extend("com.controller.Tile", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.view.Tile
		 */
		onInit: function () {
			this.result = {};
			this.result.items = [];
			// to be passed to next screen
			this.FaultCode = ""; // to be passed to next screen
			this.deviceId = ""; // to be passed to next screen
			this.filterType = ""; // to be passed to next screen
			this.waterFiltered = ""; //to be passed to next screen
			this.filterLife = "";

			//	this.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZQNX_IOT_SRV/", true);
			this.odataService = new sap.ui.model.odata.ODataModel("/IotWaterPurifier", {
				json: true
			});
			// this.odataService = this.getView().getModel("ZQNX");
			this.custId = "";
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "thingPageModel");

			var oModel1 = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel1, "Data");

			var oCustomerModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oCustomerModel, "oCustomer");

			// this.getView().addEventDelegate({
			// 	onBeforeShow: jQuery.proxy(function (evt) {
			// 		this.onBeforeShow(evt);
			// 	}, this)
			// });
			var oRef = this;
			this.odataService.read("/CustomerSet('9972594080')", null, null, false, function (
				response) {
				if (response.ValidPhoneNo === "Success") {
					oRef.getView().getModel("oCustomer").setData(response);
					//sap.ui.getCore().custId = response.BusinessPartner;
					oRef.custId = response.BusinessPartner;
					oRef.getView().getModel("oCustomer").refresh(true);
					// that.getOwnerComponent().getRouter().navTo("RouteHome");
				} else {

					MessageBox.error("Enter a valid phone number");
					//that.getView().byId("idnum").setValue("");
				}
				oRef.getView().getModel("oCustomer").refresh(true);
			});
			this.odataServiceIoT = new sap.ui.model.odata.ODataModel("/IOTAS-ADVANCEDLIST-THING-ODATA/CompositeThings/v1/", true);
			this.odataServiceIoT.read("/Things", null, null, false, function (response) {
				// console.log(response);
				var i = 0;
				for (i = 0; i < response.results.length; i++) {
					if (response.results[i].ThingDescription === "IoT Thing for Customer 1000020") {
						sap.ui.getCore().thingId1 = response.results[i].ThingId;
						sap.ui.getCore().thing1Type = response.results[i].ThingType;
					}
					if (response.results[i].ThingDescription === "Model 2 thing") {
						sap.ui.getCore().thingId2 = response.results[i].ThingId;
						sap.ui.getCore().thing1Type = response.results[i].ThingType;
					}
					if (response.results[i].ThingDescription === "Model 3 Thing") {
						sap.ui.getCore().thingId3 = response.results[i].ThingId;
						sap.ui.getCore().thing1Type = response.results[i].ThingType;
					}

				}
			});
			sap.ui.getCore().sThingId = sap.ui.getCore().thingId2;
			var oDetailsThingModel = oRef._findThingModel(sap.ui.getCore().thing1Type);
			if (oDetailsThingModel) {
				// this._readDetailsService(oDetailsThingModel, this.sThingId);
				oRef._readDetailsService(oDetailsThingModel, sap.ui.getCore().sThingId);
			} else {
				var sURL = "/IOTAS-DETAILS-THING-ODATA/CompositeThings/ThingType/v1/" + sap.ui.getCore().thing1Type;
				var oNewThingTypeModel = new sap.ui.model.odata.ODataModel(sURL);
				// this._readDetailsService(oNewThingTypeModel, this.sThingId);
				oRef._readDetailsService(oNewThingTypeModel, sap.ui.getCore().sThingId);
			}
			// var oRouter = this.getOwnerComponent().getRouter();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Tile").attachMatched(this._onObjectMatched, this);

		},
		// onBeforeShow: function (oEvent) {
		// 	this.odataServiceIoT = new sap.ui.model.odata.ODataModel("/IOTAS-ADVANCEDLIST-THING-ODATA/CompositeThings/v1/", true);
		// 	this.odataServiceIoT.read("/Things", null, null, false, function (response) {
		// 		// console.log(response);
		// 		var i = 0;
		// 		for (i = 0; i < response.results.length; i++) {
		// 			if (response.results[i].ThingDescription === "IoT Thing for Customer 1000020") {
		// 				sap.ui.getCore().thingId1 = response.results[i].ThingId;
		// 				sap.ui.getCore().thing1Type = response.results[i].ThingType;
		// 			}
		// 			if (response.results[i].ThingDescription === "Model 2 thing") {
		// 				sap.ui.getCore().thingId2 = response.results[i].ThingId;
		// 				sap.ui.getCore().thing1Type = response.results[i].ThingType;
		// 			}
		// 			if (response.results[i].ThingDescription === "Model 3 Thing") {
		// 				sap.ui.getCore().thingId3 = response.results[i].ThingId;
		// 				sap.ui.getCore().thing1Type = response.results[i].ThingType;
		// 			}

		// 		}
		// 	});
		// 	sap.ui.getCore().sThingId = sap.ui.getCore().thingId2;
		// 	var oDetailsThingModel = this._findThingModel(sap.ui.getCore().thing1Type);
		// 	if (oDetailsThingModel) {
		// 		// this._readDetailsService(oDetailsThingModel, this.sThingId);
		// 		this._readDetailsService(oDetailsThingModel, sap.ui.getCore().sThingId);
		// 	} else {
		// 		var sURL = "/IOTAS-DETAILS-THING-ODATA/CompositeThings/ThingType/v1/" + sap.ui.getCore().thing1Type;
		// 		var oNewThingTypeModel = new sap.ui.model.odata.ODataModel(sURL);
		// 		// this._readDetailsService(oNewThingTypeModel, this.sThingId);
		// 		this._readDetailsService(oNewThingTypeModel, sap.ui.getCore().sThingId);
		// 	}
		// },
		_readDetailsService: function (oDetailsModel, sThingId) {
			var that = this;
			//	var mobileNum = that.getView().byId("idnum").getValue();
			// this.odataService.read("/CustomerSet('" + mobileNum + "')", null, null, false, function (
			// 	response) {
			// 	if (response.ValidPhoneNo === "Success") {
			// 		that.getOwnerComponent().getModel("oCustomer").setData(response);
			// 		sap.ui.getCore().custId = response.BusinessPartner;
			// 		that.getOwnerComponent().getModel("oCustomer").refresh(true);
			// 		that.getOwnerComponent().getRouter().navTo("RouteHome");
			// 	}
			// });
			oDetailsModel.read("/Things('" + sThingId + "')", {
				urlParameters: {
					"$expand": "DYN_ENT_iot_quinnoxiotcf_iot_new_package__DefaultImagePropertySet,DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020"
				},
				success: function (oData) {
					var customerPhoneNumber = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.Customer_Phone_number"];
					sap.ui.getCore().CustMobNo = customerPhoneNumber;
					// if (mobileNum === customerPhoneNumber) {
					sap.ui.getCore().validationFlag = "A";
					sap.ui.getCore().deviceId = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.Device_ID"];
					sap.ui.getCore().deviceStatus = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.Device_Status"];
					sap.ui.getCore().faultCode = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.Fault_code"];
					// that.faultCode = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
					// 	"Device_IoT_1000020.Fault_code"];

					sap.ui.getCore().filterLife = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.Filter_Life"];
					sap.ui.getCore().filterType = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.Filter_Type"];
					sap.ui.getCore().tdsInput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.TDS_Input"];
					sap.ui.getCore().tdsOutput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.TDS_Output"];
					sap.ui.getCore().waterConsumption = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.Water_Consumption"];
					sap.ui.getCore().waterFiltered = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.Water_Filtered"];
					sap.ui.getCore().pHInput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.pH_Input"];
					sap.ui.getCore().pHOutput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.pH_Output"];
					//that.getView().byId("idnum").setValue("");
					//navigation code: Pass parameters in manfiest
					// that.getOwnerComponent().getRouter().navTo("Tile");
					//that.readODataService(mobileNum);
					// that.getOwnerComponent().getRouter().navTo("Tile", {
					// 	deviceId: sap.ui.getCore().deviceId,
					// 	FaultCode: sap.ui.getCore().faultCode,
					// 	filterLife: sap.ui.getCore().filterLife,
					// 	waterConsumption: sap.ui.getCore().waterConsumption,
					// 	waterFiltered: sap.ui.getCore().waterFiltered,
					// 	mobileNum: that.mobNum,
					// 	filterType: sap.ui.getCore().filterType,
					// });

					// } 
					// else {
					// 	sap.ui.getCore().validationFlag = "B";
					// 	that.callThing2Validation(sap.ui.getCore().thingId2);
					// }
					// that.waterFiltered = sap.ui.getCore().waterFiltered;
					// filterLife = sap.ui.getCore().filterLife;
					// that.filterConsumed = ((that.waterFiltered / filterLife) * 100);
					sap.ui.getCore().filterConsumed = ((sap.ui.getCore().waterFiltered / sap.ui.getCore().filterLife) * 100);
					sap.ui.getCore().filterConsumed = Math.round(sap.ui.getCore().filterConsumed);

					that.getView().byId("id3").setValue(sap.ui.getCore().filterConsumed);

					//this.odataService.read("/CustomerSet('" + mobNum + "')", null, null, false, function (
					// this.odataService.read("/CustomerSet('9972594080')", null, null, false, function (
					// 	response) {
					// 	if (response.ValidPhoneNo === "Success") {
					// 		that.getOwnerComponent().getModel("oCustomer").setData(response);
					// 		//sap.ui.getCore().custId = response.BusinessPartner;
					// 		that.custId = response.BusinessPartner;
					// 		that.getOwnerComponent().getModel("oCustomer").refresh(true);
					// 		// that.getOwnerComponent().getRouter().navTo("RouteHome");
					// 	} else {

					// 		MessageBox.error("Enter a valid phone number");
					// 		//that.getView().byId("idnum").setValue("");
					// 	}
					// 	that.getOwnerComponent().getModel("oCustomer").refresh(true);
					// });
					// var waterConsumption = sap.ui.getCore().waterConsumption;
					that.getView().byId("id1").setValue(sap.ui.getCore().waterConsumption);

				},
				error: function (oError) {
					jQuery.sap.log.error(oError);
					sap.ui.getCore().byId("idBusy").close();
				}
			});

		},
		_findThingModel: function (sThingType) {
			//Create a loop and just check how many thingModels are created and break if there is no thingModel
			for (var i = 1; i < 100; i++) {
				if (this.getOwnerComponent().getModel("thingModel" + i)) {
					//Compare the thingType with the thingModel thingtype , if it matches then return that thingModel
					var sServiceURL = this.getOwnerComponent().getModel("thingModel" + i).sServiceUrl;
					var matchedThingType = sServiceURL.substring(sServiceURL.lastIndexOf("/") + 1);
					if (sThingType === matchedThingType) {
						return this.getOwnerComponent().getModel("thingModel" + i);
					}
				} else {
					jQuery.sap.log.error(
						"The thingType has not matched with the ThingModel created in the Manifest file , hence need to create a new oData Model for this thingType"
					);
					break;
				}
			}

		},

		_onObjectMatched: function (oEvent) {
			this.odataServiceIoT = new sap.ui.model.odata.ODataModel("/IOTAS-ADVANCEDLIST-THING-ODATA/CompositeThings/v1/", true);
			this.odataServiceIoT.read("/Things", null, null, false, function (response) {
				// console.log(response);
				var i = 0;
				for (i = 0; i < response.results.length; i++) {
					if (response.results[i].ThingDescription === "IoT Thing for Customer 1000020") {
						sap.ui.getCore().thingId1 = response.results[i].ThingId;
						sap.ui.getCore().thing1Type = response.results[i].ThingType;
					}
					if (response.results[i].ThingDescription === "Model 2 thing") {
						sap.ui.getCore().thingId2 = response.results[i].ThingId;
						sap.ui.getCore().thing1Type = response.results[i].ThingType;
					}
					if (response.results[i].ThingDescription === "Model 3 Thing") {
						sap.ui.getCore().thingId3 = response.results[i].ThingId;
						sap.ui.getCore().thing1Type = response.results[i].ThingType;
					}

				}
			});
			var oRef = this;
			sap.ui.getCore().sThingId = sap.ui.getCore().thingId2;
			var oDetailsThingModel = oRef._findThingModel(sap.ui.getCore().thing1Type);
			if (oDetailsThingModel) {
				// this._readDetailsService(oDetailsThingModel, this.sThingId);
				oRef._readDetailsService(oDetailsThingModel, sap.ui.getCore().sThingId);
			} else {
				var sURL = "/IOTAS-DETAILS-THING-ODATA/CompositeThings/ThingType/v1/" + sap.ui.getCore().thing1Type;
				var oNewThingTypeModel = new sap.ui.model.odata.ODataModel(sURL);
				// this._readDetailsService(oNewThingTypeModel, this.sThingId);
				oRef._readDetailsService(oNewThingTypeModel, sap.ui.getCore().sThingId);
			}
		},

		// _onRouteMatched: function () {
		// 	var that = this;

		// 	// this.odataService.read("/CustomerSet('" + sap.ui.getCore().CustMobNo + "')", null, null, false, function (
		// 	// 	response) {
		// 	// 	if (response.ValidPhoneNo === "Success") {
		// 	// 		that.getOwnerComponent().getModel("oCustomer").setData(response);
		// 	// 		sap.ui.getCore().custId = response.BusinessPartner;
		// 	// 		that.getOwnerComponent().getModel("oCustomer").refresh(true);
		// 	// 	}
		// 	// });

		// 	var waterConsumption = sap.ui.getCore().waterConsumption;
		// 	this.getView().byId("id1").setValue(waterConsumption);

		// 	//FilterType
		// 	// var filterType = sap.ui.getCore().filterType;
		// 	//   this.getView().byId("id2").setText(filterType);

		// 	//FilterLife
		// 	var filterLife = sap.ui.getCore().filterLife;
		// 	this.getView().byId("id3").setValue(filterLife);
		// },
		// onAfterRendering: function () {

		// 	//WaterConsumption
		// 	var waterConsumption = sap.ui.getCore().waterConsumption;
		// 	this.getView().byId("id1").setValue(waterConsumption);

		// 	//FilterType
		// 		// var filterType = sap.ui.getCore().filterType;
		// 	 //   this.getView().byId("id2").setText(filterType);

		// 	//FilterLife
		// 	var filterLife = sap.ui.getCore().filterLife;
		// 	this.getView().byId("id3").setValue(filterLife);
		// },
		onWaterQualityPress: function () {

			var that = this;

			// that.getOwnerComponent().getRouter().navTo("WaterQuality");
			var oProperty = "Device_IoT_1000020.TDS_Output";
			that.getOwnerComponent().getRouter().navTo("TDSOutput", {

				navFrom: "measuredValues",
				headerTitle: " ",
				subHeaderTitle: " ",
				mpPath: oProperty
			});
		},
		onFilterLifePress: function (evt) {
			// var filterCapacity = 10000;
			// var waterFiltered = 2500;
			// var filterConsumed = ((waterFiltered / filterCapacity) * 100);
			// console.log(filterConsumed);
			// sap.ui.getCore().filterConsumed = ((sap.ui.getCore().waterConsumption / sap.ui.getCore().filterLife) * 100);
			// sap.ui.getCore().filterConsumed = Math.round(sap.ui.getCore().filterConsumed);
			// var filterConsumed = ((sap.ui.getCore().waterFiltered / sap.ui.getCore().filterLife) * 100);
			// filterConsumed = Math.round(filterConsumed);
			var that = this;
			// that.getView().byId("id3").setValue(filterConsumed);

			that.getOwnerComponent().getRouter().navTo("FilterLife", {
				FilterConsumed: sap.ui.getCore().filterConsumed,
				filterType: sap.ui.getCore().filterType,
				waterFiltered: sap.ui.getCore().waterFiltered

			});
			//this.getOwnerComponent().getRouter().navTo("FilterLife");
		},
		onServiceHistoryPress: function () {
			var that = this;
			//that.getOwnerComponent().getRouter().navTo("ServiceHistory");
			that.getOwnerComponent().getRouter().navTo("ServiceHistory", {
				customerID: that.custId,
				deviceId: sap.ui.getCore().deviceId
			});
			// var that = this;

			// this.odataService.read("/ServiceHistorySet?$filter=CustomerID eq '" + sap.ui.getCore().custId + "'", null, null, false, function (
			// 	response) {

			// 	that.getOwnerComponent().getModel("oserviceHistory").setData(response);
			// 	that.getOwnerComponent().getModel("oserviceHistory").refresh(true);
			// 	that.getOwnerComponent().getRouter().navTo("ServiceHistory");

			// });
		},
		onServiceRequestPress: function () {
			var that = this;
			//this.getOwnerComponent().getRouter().navTo("ServiceRequestCreation");

			this.getOwnerComponent().getRouter().navTo("ServiceRequestCreation", {
				customerID: that.custId,
				deviceId: sap.ui.getCore().deviceId
			});
		},
		onPressBack: function () {
			var that = this;
			that.getView().byId("id1").setValue("");
			that.getView().byId("id3").setValue("");
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				//this.getOwnerComponent().getRouter().navTo("Main", null, true);
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
		 * @memberOf com.view.Tile
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.view.Tile
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.view.Tile
		 */
		//	onExit: function() {
		//
		//	}

	});

});
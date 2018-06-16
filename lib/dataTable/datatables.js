/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs/dt-1.10.16/e-1.7.3/af-2.2.2/b-1.5.1/b-print-1.5.1/cr-1.4.1/fc-3.2.4/kt-2.3.2/r-2.2.1/rr-1.2.3/sl-1.2.5
 *
 * Included libraries:
 *   DataTables 1.10.16, Editor 1.7.3, AutoFill 2.2.2, Buttons 1.5.1, Print view 1.5.1, ColReorder 1.4.1, FixedColumns 3.2.4, KeyTable 2.3.2, Responsive 2.2.1, RowReorder 1.2.3, Select 1.2.5
 */

/*! DataTables 1.10.16
 * ©2008-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.16
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2017 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ) );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if ( s.nTable == this || s.nTHead.parentNode == this || (s.nTFoot && s.nTFoot.parentNode == this) )
				{
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			
			if ( oInit.oLanguage )
			{
				_fnLanguageCompat( oInit.oLanguage );
			}
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = $.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').appendTo($this);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	//   standards as thousands separators.
	var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		var defaults = DataTable.defaults.oLanguage;
		var zeroRecords = lang.sZeroRecords;
	
		/* Backwards compatibility - if there is no sEmptyTable given, then use the same as
		 * sZeroRecords - assuming that is given.
		 */
		if ( ! lang.sEmptyTable && zeroRecords &&
			defaults.sEmptyTable === "No data available in table" )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
		}
	
		/* Likewise with loading records */
		if ( ! lang.sLoadingRecords && zeroRecords &&
			defaults.sLoadingRecords === "Loading..." )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
		}
	
		// Old parameter name of the thousands separator mapped onto the new
		if ( lang.sInfoThousands ) {
			lang.sThousands = lang.sInfoThousands;
		}
	
		var decimal = lang.sDecimal;
		if ( decimal ) {
			_addNumericSort( decimal );
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! $.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! $.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( $.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( $.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = $.trim(cell.innerHTML);
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
	
				nTd = nTrIn ? anTds[i] : document.createElement( oCol.sCellType );
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( (!nTrIn || oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
	 	$(thead).find('>tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );
		$(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && $.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = $.isFunction( ajaxData ) ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = $.isFunction( ajaxData ) && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( $.isFunction( ajax ) )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = $.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css(
			scrollY && scroll.bCollapse ? 'max-height' : 'height', 
			scrollY
		);
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+headerContent[i]+'</div>';
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+footerContent[i]+'</div>';
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.scroll();
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! $.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( $.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		var i, ien;
		var columns = settings.aoColumns;
		var loaded = function ( s ) {
			if ( ! s || ! s.time ) {
				callback();
				return;
			}
	
			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
			if ( $.inArray( false, abStateLoad ) !== -1 ) {
				callback();
				return;
			}
	
			// Reject old data
			var duration = settings.iStateDuration;
			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
				callback();
				return;
			}
	
			// Number of columns have changed - all bets are off, no restore of settings
			if ( s.columns && columns.length !== s.columns.length ) {
				callback();
				return;
			}
	
			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend( true, {}, s );
	
			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if ( s.start !== undefined ) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			if ( s.length !== undefined ) {
				settings._iDisplayLength   = s.length;
			}
	
			// Order
			if ( s.order !== undefined ) {
				settings.aaSorting = [];
				$.each( s.order, function ( i, col ) {
					settings.aaSorting.push( col[0] >= columns.length ?
						[ 0, col[1] ] :
						col
					);
				} );
			}
	
			// Search
			if ( s.search !== undefined ) {
				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
			}
	
			// Columns
			//
			if ( s.columns ) {
				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
					var col = s.columns[i];
	
					// Visibility
					if ( col.visible !== undefined ) {
						columns[i].bVisible = col.visible;
					}
	
					// Search
					if ( col.search !== undefined ) {
						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
					}
				}
			}
	
			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
			callback();
		}
	
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			loaded( state );
		}
		// otherwise, wait for the loaded callback to be executed
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( $.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( $.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					n.blur(); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings = settings.concat( a );
			}
		};
	
		if ( $.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			j, jen,
			struct, inner,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = typeof struct.val === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				$.isPlainObject( struct.val ) ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( $.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   []
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					$.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			a = search == 'none' ?
				displayMaster.slice() :                      // no search
				search == 'applied' ?
					displayFiltered.slice() :                // applied search
					$.map( displayMaster, function (el, i) { // removed search
						return $.inArray( el, displayFiltered ) === -1 ? el : null;
					} );
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	
	
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = settings.aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - node
			if ( sel.nodeName ) {
				if ( sel._DT_RowIndex !== undefined ) {
					return [ sel._DT_RowIndex ]; // Property added by DT for fast lookup
				}
				else if ( sel._DT_CellIndex ) {
					return [ sel._DT_CellIndex.row ];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		ctx[0].aoData[ this[0] ]._aData = data;
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( $.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td/></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		_fnSaveState( settings );
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			// Second loop once the first is done for events
			this.iterator( 'column', function ( settings, column ) {
				_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
			} );
	
			if ( calc === undefined || calc ) {
				this.columns.adjust();
			}
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $( [].concat.apply([], cells) );
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				return [s];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// Row + column selector
		var columns = this.columns( columnSelector, opts );
		var rows = this.rows( rowSelector, opts );
		var a, i, ien, j, jen;
	
		var cells = this.iterator( 'table', function ( settings, idx ) {
			a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! $.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return $.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );

	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.16";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would at around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit.
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "platform.details.0" },
		 *          { "data": "platform.details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"bs/dt-1.10.16/e-1.7.3/af-2.2.2/b-1.5.1/b-print-1.5.1/cr-1.4.1/fc-3.2.4/kt-2.3.2/r-2.2.1/rr-1.2.3/sl-1.2.5",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! $.isNumeric( data.substring(1) ) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( $.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = '';
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								default:
									btnDisplay = button + 1;
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': settings.iTabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			return Date.parse( d ) || -Infinity;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, searcg or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-6'l><'col-sm-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-5'i><'col-sm-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper form-inline dt-bootstrap",
	sFilterInput:  "form-control input-sm",
	sLengthSelect: "form-control input-sm",
	sProcessing:   "dataTables_processing panel panel-default"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( $.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
	}
};


return DataTable;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     1.7.3
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2018 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */
r722.w2c="le";r722.E2c="";r722.R2c="a";r722.D2c="ion";r722.h3=function (){return typeof r722.E3.k==='function'?r722.E3.k.apply(r722.E3,arguments):r722.E3.k;};r722.K2c='object';r722.c3=function (){return typeof r722.E3.k==='function'?r722.E3.k.apply(r722.E3,arguments):r722.E3.k;};r722.z2c="s";r722.S2c="fn";r722.p2c="b";r722.E3=function(R0,F0){var Y3=2;while(Y3!==10){switch(Y3){case 11:return{k:function(r0,U0){var Z3=2;while(Z3!==16){switch(Z3){case 12:Z3=!t0?11:17;break;case 19:(function(){var D3=2;while(D3!==75){switch(D3){case 13:s0=19;D3=1;break;case 46:Q0+=T0;Q0+=H0;D3=65;break;case 57:var O0="n";var M0="u";var v0=M0;v0+=O0;D3=76;break;case 50:s0=32;D3=1;break;case 34:s0=26;D3=1;break;case 33:D3=s0===8?32:42;break;case 7:var G0="0";var X0="6";D3=14;break;case 19:s0=4;D3=1;break;case 18:D3=s0===4?17:26;break;case 22:var H0="f";var T0="e";var j0="d";D3=34;break;case 14:var J0="G";D3=13;break;case 37:D3=s0===22?36:49;break;case 8:D3=s0===11?7:12;break;case 27:s0=8;D3=1;break;case 2:var s0=2;D3=1;break;case 32:var k0="8";var l0="o";var q0="x";var P0="r";D3=28;break;case 61:Q0+=T0;Q0+=j0;D3=59;break;case 53:v0+=H0;v0+=I0;v0+=O0;D3=50;break;case 63:Q0+=I0;Q0+=O0;D3=61;break;case 28:var u0="P";var a0="j";D3=43;break;case 59:s0=38;D3=1;break;case 4:var W3=typeof window!==Q0?window:typeof global!==v0?global:L3;try{var f3=2;while(f3!==76){switch(f3){case 40:p0+=P0;p0+=q0;f3=38;break;case 6:S0=43;f3=1;break;case 48:S0=10;f3=1;break;case 30:p0+=l0;p0+=k0;f3=28;break;case 1:f3=S0!==36?5:76;break;case 7:d0+=g3;f3=6;break;case 51:f3=S0===12?50:47;break;case 63:S0=31;f3=1;break;case 31:f3=S0===25?30:44;break;case 62:f3=S0===2?61:1;break;case 4:d0+=P0;d0+=T0;d0+=j0;f3=8;break;case 58:w0+=G0;w0+=a0;f3=56;break;case 33:w0+=o0;f3=32;break;case 44:f3=S0===17?43:37;break;case 8:d0+=R3;f3=7;break;case 17:d0+=P0;d0+=O0;d0+=I0;f3=27;break;case 77:S0=7;f3=1;break;case 28:S0=23;f3=1;break;case 46:var d0=T0;d0+=q0;d0+=b3;d0+=I0;f3=63;break;case 47:f3=S0===35?46:62;break;case 13:p0+=o0;p0+=n0;p0+=O0;f3=10;break;case 18:f3=S0===43?17:22;break;case 21:w0+=q0;w0+=l0;w0+=k0;f3=33;break;case 32:S0=12;f3=1;break;case 43:p0+=G0;p0+=a0;p0+=u0;f3=40;break;case 5:f3=S0===31?4:14;break;case 37:f3=S0===20?36:51;break;case 10:S0=35;f3=1;break;case 20:f3=S0===10?19:18;break;case 36:var p0=F3;p0+=J0;p0+=X0;f3=52;break;case 50:w0+=n0;w0+=O0;f3=48;break;case 52:S0=17;f3=1;break;case 19:S0=!W3[w0]?20:36;f3=1;break;case 14:f3=S0===23?13:20;break;case 61:var w0=F3;w0+=J0;w0+=X0;f3=58;break;case 22:f3=S0===7?21:31;break;case 27:d0+=O0;d0+=x3;window[d0]();W3[p0]=function(){};f3=23;break;case 23:S0=36;f3=1;break;case 38:S0=25;f3=1;break;case 56:w0+=u0;w0+=P0;f3=77;break;case 2:var S0=2;f3=1;break;}}}catch(y3){}D3=9;break;case 36:v0+=j0;v0+=T0;D3=53;break;case 26:D3=s0===19?25:33;break;case 38:s0=29;D3=1;break;case 12:D3=s0===2?11:18;break;case 76:s0=22;D3=1;break;case 65:s0=42;D3=1;break;case 25:var F3="_";var L3=null;var I0="i";D3=22;break;case 49:D3=s0===29?48:64;break;case 41:v0+=T0;v0+=j0;var Q0=M0;D3=38;break;case 43:s0=11;D3=1;break;case 48:Q0+=O0;Q0+=j0;D3=46;break;case 9:s0=36;D3=1;break;case 42:D3=s0===32?41:37;break;case 1:D3=s0!==36?5:75;break;case 5:D3=s0===38?4:8;break;case 64:D3=s0===42?63:58;break;case 11:var x3="g";var g3="a";var R3="W";D3=19;break;case 17:var b3="p";var n0="9";var o0="J";D3=27;break;case 58:D3=s0===26?57:1;break;}}}());Z3=18;break;case 14:B0++;Z3=3;break;case 18:K0=1;Z3=10;break;case 13:i0=i0^z0;Z3=14;break;case 2:Z3=!W0--?1:5;break;case 20:Z3=K0===2?19:10;break;case 11:var K0=2;Z3=10;break;case 1:U0=L0[F0[4]];Z3=5;break;case 10:Z3=K0!==1?20:17;break;case 17:return i0?t0:!t0;break;case 6:i0=z0;Z3=14;break;case 4:var t0=b0;Z3=3;break;case 5:var i0,B0=0;Z3=4;break;case 3:Z3=B0<r0[F0[5]]?9:12;break;case 9:var C0=U0(r0[F0[2]](B0),16)[F0[3]](2);var z0=C0[F0[2]](C0[F0[5]]-1);Z3=7;break;case 7:Z3=B0===0?6:13;break;}}}};break;case 6:Y3=!W0--?14:13;break;case 1:Y3=!W0--?5:4;break;case 7:x0=g0.replace(new L0[Y0]("^['-|]"),'S');Y3=6;break;case 8:Y3=!W0--?7:6;break;case 14:F0=F0.map(function(e0){var V3=2;while(V3!==13){switch(V3){case 2:var N0;V3=1;break;case 1:V3=!W0--?5:4;break;case 5:N0='';V3=4;break;case 4:var A0=0;V3=3;break;case 3:V3=A0<e0.length?9:7;break;case 7:V3=!N0?6:14;break;case 8:A0++;V3=3;break;case 9:N0+=L0[x0][y0](e0[A0]+99);V3=8;break;case 6:return;break;case 14:return N0;break;}}});Y3=13;break;case 5:L0=F0.filter.constructor(R0)();Y3=4;break;case 12:b0=b0(new L0[F0[0]]()[F0[1]]());Y3=11;break;case 9:var y0='fromCharCode',Y0='RegExp';Y3=8;break;case 2:var L0,g0,x0,W0;Y3=1;break;case 3:g0=typeof R0;Y3=9;break;case 4:Y3=!W0--?3:9;break;case 13:Y3=!W0--?12:11;break;}}function b0(Z0){var m3=2;while(m3!==15){switch(m3){case 17:D0=Z0-V0>m0;m3=19;break;case 16:D0=f0-Z0>m0;m3=19;break;case 4:m3=!W0--?3:9;break;case 1:m3=!W0--?5:4;break;case 14:m3=!W0--?13:12;break;case 20:D0=Z0-V0>m0&&f0-Z0>m0;m3=19;break;case 7:m3=!W0--?6:14;break;case 11:V0=(E0||E0===0)&&h0(E0,m0);m3=10;break;case 19:return D0;break;case 10:m3=V0>=0&&f0>=0?20:18;break;case 12:m3=!W0--?11:10;break;case 8:c0=F0[6];m3=7;break;case 2:var D0,m0,c0,f0,E0,V0,h0;m3=1;break;case 13:E0=F0[7];m3=12;break;case 6:f0=c0&&h0(c0,m0);m3=14;break;case 3:m0=26;m3=9;break;case 18:m3=V0>=0?17:16;break;case 9:m3=!W0--?8:7;break;case 5:h0=L0[F0[4]];m3=4;break;}}}}('return this',[[-31,-2,17,2],[4,2,17,-15,6,10,2],[0,5,-2,15,-34,17],[17,12,-16,17,15,6,11,4],[13,-2,15,16,2,-26,11,17],[9,2,11,4,17,5],[-44,-44,11,3,10,-44,12,8,-51],[-44,-45,3,0,5,11,-50,-42,-2]]);r722.Y2c="e";r722.e2c="y";function r722(){}r722.A2c="er";r722.m2c="f";r722.g2c="m";r722.x2c="d";r722.F05=function(l1){if(r722&&l1)return r722.c3(l1);};r722.F4=function(l7){if(r722)return r722.c3(l7);};r722.O8=function(v8){if(r722)return r722.c3(v8);};r722.O2=function(v2){if(r722&&v2)return r722.h3(v2);};r722.F2=function(l5){if(r722&&l5)return r722.c3(l5);};r722.h5=function(c5){if(r722&&c5)return r722.h3(c5);};r722.Q6=function(S6){if(r722&&S6)return r722.c3(S6);};(function(factory){var b5l=r722;var U2c="fb";var r2c="b5";var C2c="export";var t2c="66db";var i2c="3218";var B2c="9a6e";var N2c="jqu";var h2c="bles.net";var c2c="datata";var f2c="ba23";var Z2c="funct";var V2c="4";var y2c="9";var b05=b5l.R2c;b05+=b5l.g2c;b05+=b5l.x2c;var L05=y2c;L05+=b5l.Y2c;L05+=b5l.m2c;L05+=V2c;var W05=Z2c;W05+=b5l.D2c;b5l.B9=function(e9){if(b5l&&e9)return b5l.h3(e9);};b5l.k3=function(M3){if(b5l&&M3)return b5l.c3(M3);};if(typeof define===(b5l.k3(f2c)?b5l.E2c:W05)&&define[b5l.Q6(L05)?b5l.E2c:b05]){var g05=c2c;g05+=h2c;var R05=N2c;R05+=b5l.A2c;R05+=b5l.e2c;define([b5l.h5(B2c)?R05:b5l.E2c,b5l.F2(i2c)?b5l.E2c:g05],function($){return factory($,window,document);});}else if(typeof exports===(b5l.O2(t2c)?b5l.E2c:b5l.K2c)){var y05=C2c;y05+=b5l.z2c;var x05=r2c;x05+=U2c;module[b5l.B9(x05)?b5l.E2c:y05]=function(root,$){var T2c="document";var O2c="$";var v2c="82";var Q2c="74ed";var s2c="98b1";var d2c="dataT";var Y05=d2c;Y05+=b5l.R2c;Y05+=b5l.p2c;Y05+=b5l.w2c;b5l.A7=function(N7){if(b5l)return b5l.h3(N7);};b5l.L8=function(W8){if(b5l)return b5l.c3(W8);};if(!root){root=window;}if(!$||!$[b5l.L8(s2c)?b5l.S2c:b5l.E2c][b5l.O8(Q2c)?b5l.E2c:Y05]){var m05=v2c;m05+=y2c;m05+=b5l.x2c;$=require('datatables.net')(root,$)[b5l.A7(m05)?b5l.E2c:O2c];}return factory($,root,root[T2c]);};}else{factory(jQuery,window,document);}}(function($,window,document,undefined){var R5l=r722;var H6l="1.7.3";var X6l="version";var u6l="Editor";var G6l="editorFields";var z6l="pes";var J4n="fieldTypes";var i7n="getUT";var B7n="2";var E7n="_optionSet";var O8n="_pad";var v8n="ix";var d8n='</option>';var U8n="lue=\"";var r8n="<option va";var z8n='select.';var t8n="tD";var n9n="ray";var v9n="firstDay";var t9n="year";var e9n="selected";var y9n="\" ";var R9n="namespace";var b9n="n.";var k2n="etUTC";var M2n="getSeconds";var G2n="Date";var a2n="getUTCFullYear";var P2n="Month";var Q2n="setUTCDate";var S2n='month';var s2n="Utc";var z2n="selec";var i2n="sel";var N2n="getUTCMonth";var E2n="setUTCMonth";var D2n="UT";var Y2n='disabled';var y2n="las";var T5n="TC";var O5n="setU";var p5n="onth";var U5n="_co";var z5n="month";var t5n="_posit";var i5n='change';var N5n="np";var h5n='am';var c5n="_options";var y5n="time";var L5n="fix";var W5n="Pre";var F5n="class";var M6n="par";var G6n="min";var n6n="npu";var P6n="_setTime";var T6n="_writeOutput";var O6n="UTC";var S6n="utc";var p6n="mome";var e6n="_optionsTitle";var c6n="_setCalander";var E6n="maxDate";var D6n="optio";var m6n="inpu";var l3n='ampm';var k3n='seconds';var M3n='minutes';var Q3n="-icon";var r3n="utton";var C3n="</";var t3n='YYYY-MM-DD';var i3n="format";var B3n="moment";var e3n="classPrefix";var c3n="n>";var E3n="tto";var D3n="/div>";var Y3n="<b";var k0n="-";var T0n="DateTime";var d0n="str";var e0n="tl";var l1z="select";var n1z="exte";var I1z="elec";var S1z="DTE_Bubble_Triangle";var s1z="icon close";var w1z="DTE_Bubble_Table";var p1z="DTE DTE_Bubble";var d1z="DTE_Inline_Buttons";var U1z="DTE_Inline_Field";var r1z="DTE DTE_Inline";var z1z="DTE_Action_Remove";var C1z="DTE_Action_Edit";var K1z="DTE_Action_Create";var t1z="multi-noEdit";var i1z="DTE_Field_Message";var B1z="DTE_Field_Error";var e1z="DTE_Label_Info";var A1z="DTE_Field_Input";var N1z="DTE_Label";var h1z="DTE_Field_Type_";var c1z="DTE_Form_Info";var E1z="DTE_Footer";var f1z="DTE_Header_Content";var D1z="DTE_Processing_Indicator";var P4z="attr";var I4z="filter";var Q4z="gt";var B4z="tabl";var h4z="dr";var R4z="Ty";var b4z="cel";var L4z="columns";var I7z="eng";var w7z="indexes";var e7z="tm";var A7z='pm';var N7z='Wed';var h7z='Sun';var c7z='October';var E7z='July';var f7z='February';var D7z='January';var Z7z='Previous';var V7z="This input can be edited individually, but not part of a group.";var m7z="Multiple values";var Y7z="A system error has occurred (<a target=\"_blank\" href=\"//datatables.net/tn/12\">More information</a>).";var y7z="Are you sure you wish to delete %d rows?";var x7z="Delete";var g7z="Create new entry";var R7z="New";var b7z='DT_RowId';var L7z="defaults";var j8z="clos";var m8z="ple";var y8z="pus";var g8z="our";var F8z="ctDataFn";var H9z="onComplete";var j9z='changed';var Q9z="ngt";var i9z="tC";var f9z="ubmit";var m9z="processing";var k2z='open';var X2z="ents";var u2z="ement";var o2z="act";var w2z="In";var d2z="lay";var C2z="options";var t2z='send';var A2z="next";var N2z="pre";var f2z="parents";var X5z="tt";var G5z="itle";var o5z="editCount";var Q5z="omplete";var S5z="onC";var z5z="ction";var N5z="ind";var c5z="_fieldFromNode";var x5z="E";var R5z="indexOf";var b5z="triggerHandler";var l6z="displayFields";var I6z="isplay";var v6z="ultiEdit";var U6z="]";var K6z="ields";var Z6z='focus.editor-focus';var m6z="closeIcb";var Y6z="closeCb";var R6z="vent";var k3z="onBlu";var M3z="eve";var J3z="ubm";var j3z="omp";var Q3z="ext";var s3z="split";var V3z="rem";var L3z="_ajax";var o0z="init";var n0z="_optionsUpdate";var I0z="ft";var s0z="8n";var w0z="i1";var d0z="TableTools";var B0z="footer";var E0z="idSrc";var f0z="dbTable";var m0z="tab";var L0z="div";var P1k="ons";var v1k="bod";var s1k="ing";var K1k="even";var i1k="bm";var A1k="tend";var N1k="rror";var h1k="status";var c1k="rs";var E1k="fieldErr";var f1k="fieldErrors";var m1k="load";var X4k="th";var u4k="leng";var T4k="io";var O4k="pend";var v4k="aj";var S4k="aja";var s4k="ad";var B4k="upload";var A4k="label";var N4k="value";var h4k="lab";var c4k="ngth";var D4k="pairs";var m4k="pa";var Y4k='xhr.dt';var x4k='cells().edit()';var b4k='remove';var L4k='rows().delete()';var F4k='row().delete()';var l7k='rows().edit()';var k7k='edit';var M7k="create";var J7k='row.create()';var H7k='editor()';var G7k="confirm";var o7k="tle";var n7k="utto";var a7k="_editor";var P7k="tex";var I7k="register";var j7k="Api";var O7k="childre";var s7k="template";var p7k="_processing";var d7k="sing";var C7k="q";var K7k="cus";var t7k="editOpts";var i7k='node';var B7k="_dataSource";var e7k="Fields";var N7k="_even";var f7k="Op";var V7k="join";var m7k='-';var y7k="oi";var g7k='main';var M8k="edi";var J8k="cu";var X8k="_eve";var u8k="one";var n8k="_event";var q8k="rray";var P8k="isA";var I8k="multiSet";var T8k="ie";var Q8k="acti";var S8k="_message";var s8k="addBack";var C8k="off";var B8k="_closeReg";var e8k="ce";var A8k="formError";var N8k='.';var h8k='div.';var c8k="find";var f8k='inline';var b8k="_da";var H9k="ss=\"";var o9k="ttons";var n9k="bu";var a9k="ocus";var P9k="Er";var v9k=":";var Q9k="hi";var s9k="get";var w9k="file";var z9k="elds";var C9k="sa";var e9k="rce";var A9k="ou";var N9k="_dataS";var h9k="pts";var c9k="ns";var D9k="map";var Z9k="displayed";var V9k="pen";var m9k="_fieldNames";var Y9k="disable";var L9k="destroy";var W9k="ajax";var M2k="rows";var J2k='data';var H2k="fin";var X2k="ws";var u2k="fun";var G2k="event";var o2k="date";var I2k='label';var T2k="up";var O2k='json';var v2k='POST';var s2k="gth";var w2k="len";var p2k="xt";var U2k="maybeOpen";var r2k="_formOptions";var z2k="_assembleMain";var K2k="_actionClass";var t2k="modifier";var B2k="editFields";var h2k="udAr";var c2k="_cr";var E2k="eate";var f2k="cr";var D2k="rm";var V2k="rd";var y2k="ven";var R2k="fiel";var b2k="field";var F2k="sp";var l5k="tri";var k5k="clear";var H5k="key";var u5k="keyCode";var n5k="form";var I5k="tr";var T5k="utt";var O5k="empty";var v5k="mit";var Q5k="action";var S5k='_basic';var r5k="left";var z5k="offset";var C5k="lef";var f5k="cs";var D5k="_postopen";var Z5k="includeFields";var m5k="_close";var y5k="_clearDynamicInfo";var x5k="ff";var R5k="re";var b5k="tons";var L5k="ut";var W5k="buttons";var F5k="header";var l6k="title";var M6k="for";var H6k="eq";var X6k="appendTo";var o6k='" />';var a6k='<div class="';var P6k="concat";var I6k="bubbleNodes";var j6k="bubblePosition";var T6k="_preopen";var O6k='bubble';var v6k="_edit";var Q6k='boolean';var s6k="_tidy";var w6k="ec";var d6k="ble";var U6k="ataSource";var t6k="att";var B6k="ass";var A6k="<div";var N6k="</div";var h6k="/>";var E6k="=\"";var V6k="<div class=";var g6k="sage";var R6k="mes";var F6k="bubble";var l3k="_blur";var k3k="submit";var M3k="los";var J3k='close';var H3k="blur";var X3k="onBackground";var o3k="su";var n3k="_displayReorder";var a3k="splice";var q3k="Arr";var I3k="order";var T3k="valFro";var v3k="lds";var s3k="ult";var U3k="fields";var K3k="aSource";var t3k="eld";var B3k="dd";var A3k="row";var f3k="node";var D3k="abl";var Z3k="hea";var V3k="attach";var R3k="eOut";var L3k="al";var o0k="ontent";var j0k="oter";var s0k="wrap";var C0k="und";var i0k="dt";var B0k="ma";var e0k="top";var D0k="width";var Z0k='none';var m0k="onten";var k1R="st";var M1R="disp";var a1R="lick";var O1R="style";var B1R="ra";var c1R="ent";var D1R="ay";var Z1R="ispl";var W1R="unbind";var F1R="ach";var l4R="det";var H4R="children";var G4R="appen";var o4R="ove";var n4R="em";var a4R="tion";var j4R="sc";var O4R="nf";var Q4R="offs";var s4R="ose";var d4R="htbox";var z4R="clic";var i4R="apper";var B4R="nbi";var e4R="unb";var h4R='div.DTE_Header';var c4R="conf";var E4R="he";var Z4R="wr";var V4R="erHeight";var Y4R="out";var y4R="y_Content";var x4R="div.DTE_Bod";var R4R="H";var b4R="max";var F4R="dren";var l7R="un";var M7R="rapp";var u7R="ght";var G7R="ei";var o7R="_h";var a7R="target";var I7R="ha";var j7R="bind";var T7R="ckg";var O7R="ba";var v7R='click.DTED_Lightbox';var s7R="animate";var p7R="background";var d7R='auto';var r7R="bo";var t7R="at";var i7R="nt";var e7R="ss";var c7R="of";var E7R="appe";var f7R="Ca";var D7R="_height";var Z7R="mat";var V7R="an";var m7R="round";var W7R="per";var F7R="rap";var X8R='opacity';var u8R="content";var G8R="_r";var q8R="wrapp";var I8R="bac";var T8R="_d";var O8R="_hide";var v8R="sho";var Q8R="sh";var S8R="_show";var s8R="close";var w8R="_dom";var p8R="append";var d8R="detach";var U8R="_dte";var C8R="ap";var K8R="ow";var t8R="_s";var B8R="_i";var f8R="v>";var D8R="</di";var Y8R="splay";var y8R="display";var x8R='blur';var g8R="formOptions";var R8R="button";var b8R="fieldType";var L8R="displayController";var W8R="text";var F8R="models";var l9R="ll";var k9R="ca";var H9R="_multiInfo";var o9R="bl";var a9R="rn";var j9R="ml";var T9R="clas";var v9R="no";var S9R="sl";var s9R="table";var w9R="unction";var d9R="is";var r9R='block';var t9R="remove";var B9R="pl";var e9R="k";var A9R="lo";var N9R="slideDown";var h9R="ner";var E9R="hos";var Z9R="lengt";var V9R="isArray";var g9R='&';var b9R="replace";var W9R='string';var F9R="ace";var l2R="ac";var k2R="rep";var M2R="repl";var J2R="peFn";var H2R="_ty";var X2R="tain";var u2R="each";var G2R="isPlainObject";var o2R="inArray";var n2R="_multiValueCheck";var a2R="val";var q2R="isMultiValue";var P2R="multiIds";var I2R="multiValues";var T2R="lt";var v2R="do";var s2R="html";var w2R="nfo";var d2R="ht";var U2R="end";var r2R="app";var z2R="play";var K2R="host";var i2R="con";var B2R="pla";var e2R="dis";var A2R="ue";var h2R="focus";var f2R="put";var D2R="oc";var Z2R="typ";var V2R="fo";var Y2R='input';var y2R="nput";var g2R="multiValue";var b2R="_msg";var L2R="Info";var W2R="ld";var F2R="fieldError";var k5R="_typeFn";var M5R="removeClass";var J5R="ror";var H5R="error";var X5R="Class";var u5R="add";var G5R="classes";var o5R="g";var a5R="disabled";var q5R="ine";var j5R="cla";var T5R="container";var O5R="lass";var w5R='display';var p5R='body';var d5R="iner";var U5R="cont";var r5R="parent";var z5R="non";var K5R="addClass";var i5R="co";var e5R="led";var A5R="disa";var f5R="tio";var Z5R="op";var V5R="apply";var m5R="unshift";var Y5R="call";var y5R="slice";var x5R="prototype";var R5R='function';var L5R='click';var W5R="on";var l6R="va";var k6R='readonly';var M6R="hasClass";var J6R="multiEditable";var H6R="opts";var u6R="di";var o6R="dom";var a6R="css";var q6R="displa";var j6R="en";var O6R=null;var v6R='create';var S6R="message";var p6R='</span>';var d6R="info";var U6R='">';var r6R="multiInfo";var z6R='"/>';var C6R="inputControl";var t6R='</label>';var i6R='</div>';var e6R="safeId";var N6R="className";var E6R=' ';var f6R="wrapper";var V6R="Fn";var y6R="_f";var x6R="oApi";var g6R="data";var R6R="name";var L6R="Fi";var W6R="id";var F6R="settings";var J3R="Field";var H3R="extend";var X3R="multi";var u3R="i18n";var n3R="fie";var a3R="iel";var q3R="am";var I3R="da";var j3R="ta";var T3R="Data";var Q3R="v";var s3R="<di";var w3R="na";var p3R="be";var r3R="bel";var z3R="el";var t3R="la";var A3R="lass=\"";var b3R=" class=\"";var l0R="/";var k0R="<";var J0R="dte";var u0R=">";var G0R="\"";var o0R="iv>";var n0R="</d";var I0R="om";var j0R="rol";var O0R="input";var v0R="ab";var s0R="essag";var d0R="alue";var r0R="ulti";var C0R="eac";var K0R=true;var t0R=false;var i0R="length";var B0R="ject";var e0R="ct";var A0R="j";var h0R="ength";var c0R="ng";var E0R="push";var V0R="files";var g0R="in";var R0R=" ";var b0R="pu";var L0R='"]';var F0R="ata";var k1c="DataTable";var X1c='Editor requires DataTables 1.10.7 or newer';var u1c='1.10.7';var G1c="versionCheck";var o1c="dataTable";var v1c='s';var Q1c='';var p1c="DataTa";var E1c="8";var D1c="ge";var V1c="1";var Y1c="ck";var y1c="versionChe";var x1c="Edit";var g1c="Edito";var R1c="ield";var b1c="ault";var L1c="ef";var W1c="els";var F1c="etting";var l4c="Fiel";var k4c="ls";var M4c="mod";var J4c="dels";var H4c="mo";var X4c="ngs";var u4c="ti";var G4c="set";var o4c="mode";var n4c="sub";var a4c="clo";var q4c="cl";var P4c="os";var I4c="grou";var j4c="back";var T4c="se";var O4c="ate";var v4c="c";var Q4c="pendent";var S4c="de";var s4c="ayNode";var w4c="displ";var p4c="rotot";var d4c="nable";var U4c="ds";var r4c="fi";var z4c="ty";var C4c="roto";var K4c="les";var t4c="hid";var i4c="rr";var B4c="nE";var e4c="ne";var A4c="inli";var N4c="od";var h4c="oto";var c4c="ltiGet";var E4c="mu";var f4c="proto";var D4c="et";var Z4c="iS";var V4c="tot";var m4c="w";var Y4c="prototyp";var y4c="mi";var x4c="ub";var g4c="ype";var R4c="protot";var b4c="it()";var L4c=".";var W4c="row()";var F4c="cell().edit(";var l7c="e(";var k7c="il";var M7c=")";var J7c="(";var H7c="es";var X7c="fil";var u7c="ucto";var G7c="onstr";var o7c="_c";var n7c="toty";var a7c="ototy";var q7c="_assembleMai";var P7c="rototype";var I7c="earDynamicInfo";var j7c="_cl";var T7c="rototyp";var O7c="gs";var v7c="dAr";var Q7c="_cru";var S7c="urce";var s7c="aSo";var w7c="_dat";var p7c="der";var d7c="_displayReor";var U7c="me";var r7c="ntNa";var z7c="ve";var C7c="_e";var K7c="to";var t7c="ro";var i7c="dNames";var B7c="_fiel";var e7c="ot";var A7c="us";var N7c="foc";var h7c="ax";var c7c="acyAj";var E7c="_leg";var f7c="ototyp";var D7c="totype";var Z7c="totyp";var V7c="pro";var m7c="oty";var Y7c="open";var y7c="ost";var x7c="_p";var g7c="ocessing";var R7c="_pr";var b7c="otyp";var L7c="prot";var W7c="submi";var F7c="Table";var l8c="it";var k8c="_sub";var M8c="ccess";var J8c="_submitSu";var H8c="pe";var X8c="prototy";var u8c="itError";var G8c="_subm";var o8c="otype";var n8c="weakInArra";var a8c="x";var q8c="ghtbo";var P8c="li";var I8c="ea";var j8c="Cr";var T8c="try";var O8c="Edit ";var v8c="U";var Q8c="elete";var S8c=" row?";var s8c="Are you sure you wish to delete 1";var w8c="retain their individual values.";var p8c="The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will ";var d8c="ges";var U8c="Undo chan";var r8c="Nex";var z8c="ar";var C8c="ri";var K8c="J";var t8c="ust";var i8c="Aug";var B8c="eptembe";var e8c="ovemb";var A8c="N";var N8c="mber";var h8c="Dece";var c8c="M";var E8c="u";var f8c="h";var D8c="r";var Z8c="F";var V8c="S";var m8c="nd";var Y8c="te";var y8c="ic";var x8c="_b";var g8c="ed";var R8c="ang";var b8c="ch";var L8c="ader";var W8c="E_He";var F8c="dy";var l9c="Bo";var k9c="_";var M9c="Content";var J9c="DTE_Body_";var H9c="r_Conten";var X9c="oote";var u9c="DTE_F";var G9c="_Form";var o9c="TE";var n9c="ntent";var a9c="m_C";var q9c="DTE_For";var P9c="or";var I9c="DTE_Form_Err";var j9c="_Form_Buttons";var T9c="DTE";var O9c="tn";var v9c="_Name_";var Q9c="DTE_Fiel";var S9c="nputControl";var s9c="I";var w9c="Field_";var p9c="DTE_";var d9c="eError";var U9c="E_Field_Stat";var r9c="T";var z9c="_Info";var C9c="DTE_Field";var K9c="valu";var t9c="multi-";var i9c="multi-in";var B9c="restore";var e9c="ti-";var A9c="mul";var N9c="e_Liner";var h9c="TE_Bubbl";var c9c="DTE_Bubble_Backgroun";var E9c="eldType";var f9c="i";var D9c="type";var Z9c="o";var V9c="rot";var m9c="p";var Y9c="ime";var y9c="ateT";var x9c="D";var g9c="ance";var R9c="_in";var b9c="ts";var L9c="l";var W9c="au";var F9c="def";var l2c="-datetime";var k2c="editor";var M2c="etime";var J2c="dat";var H2c="n";var X2c="orField";var u2c="edit";var G2c="t";var o2c="ex";var n2c="ototype";var a2c="pr";var q2c="SS";var P2c="A";var I2c="L";var j2c="C";var J5c=500;var H5c=400;var u5c=100;var G5c=60;var O5c=27;var Q5c=24;var s5c=20;var d5c=13;var U5c=12;var r5c=11;var z5c=10;var K5c=7;var t5c=4;var i5c=3;var B5c=2;var e5c=1;var A5c=0;var N5c=j2c;N5c+=I2c;N5c+=P2c;N5c+=q2c;var h5c=a2c;h5c+=n2c;var c5c=o2c;c5c+=G2c;var Z5c=u2c;Z5c+=X2c;Z5c+=R5l.z2c;var o8S=R5l.Y2c;o8S+=H2c;var n8S=J2c;n8S+=M2c;var a8S=k2c;a8S+=l2c;var q8S=F9c;q8S+=W9c;q8S+=L9c;q8S+=b9c;var P8S=R9c;P8S+=R5l.z2c;P8S+=G2c;P8S+=g9c;var I8S=x9c;I8S+=y9c;I8S+=Y9c;var b3S=m9c;b3S+=V9c;b3S+=Z9c;b3S+=D9c;var H1b=R5l.m2c;H1b+=f9c;H1b+=E9c;H1b+=R5l.z2c;var h4b=c9c;h4b+=R5l.x2c;var c4b=x9c;c4b+=h9c;c4b+=N9c;var E4b=A9c;E4b+=e9c;E4b+=B9c;var f4b=i9c;f4b+=R5l.m2c;f4b+=Z9c;var D4b=t9c;D4b+=K9c;D4b+=R5l.Y2c;var Z4b=C9c;Z4b+=z9c;var V4b=x9c;V4b+=r9c;V4b+=U9c;V4b+=d9c;var m4b=p9c;m4b+=w9c;m4b+=s9c;m4b+=S9c;var Y4b=Q9c;Y4b+=R5l.x2c;Y4b+=v9c;var y4b=R5l.p2c;y4b+=O9c;var x4b=T9c;x4b+=j9c;var g4b=I9c;g4b+=P9c;var R4b=q9c;R4b+=a9c;R4b+=Z9c;R4b+=n9c;var b4b=x9c;b4b+=o9c;b4b+=G9c;var L4b=u9c;L4b+=X9c;L4b+=H9c;L4b+=G2c;var W4b=J9c;W4b+=M9c;var F4b=T9c;F4b+=k9c;F4b+=l9c;F4b+=F8c;var l7b=x9c;l7b+=r9c;l7b+=W8c;l7b+=L8c;var P9b=b8c;P9b+=R8c;P9b+=g8c;var I9b=x8c;I9b+=R5l.R2c;I9b+=R5l.z2c;I9b+=y8c;var j9b=o2c;j9b+=Y8c;j9b+=m8c;var T9b=R5l.R2c;T9b+=R5l.g2c;var O9b=V8c;O9b+=R5l.R2c;O9b+=G2c;var v9b=Z8c;v9b+=D8c;v9b+=f9c;var Q9b=r9c;Q9b+=f8c;Q9b+=E8c;var S9b=r9c;S9b+=E8c;S9b+=R5l.Y2c;var s9b=c8c;s9b+=Z9c;s9b+=H2c;var w9b=h8c;w9b+=N8c;var p9b=A8c;p9b+=e8c;p9b+=R5l.A2c;var d9b=V8c;d9b+=B8c;d9b+=D8c;var U9b=i8c;U9b+=t8c;var r9b=K8c;r9b+=E8c;r9b+=H2c;r9b+=R5l.Y2c;var z9b=c8c;z9b+=R5l.R2c;z9b+=R5l.e2c;var C9b=P2c;C9b+=m9c;C9b+=C8c;C9b+=L9c;var K9b=c8c;K9b+=z8c;K9b+=b8c;var t9b=r8c;t9b+=G2c;var i9b=U8c;i9b+=d8c;var B9b=p8c;B9b+=w8c;var e9b=s8c;e9b+=S8c;var A9b=x9c;A9b+=Q8c;var N9b=v8c;N9b+=m9c;N9b+=J2c;N9b+=R5l.Y2c;var h9b=O8c;h9b+=R5l.Y2c;h9b+=H2c;h9b+=T8c;var c9b=j8c;c9b+=I8c;c9b+=G2c;c9b+=R5l.Y2c;var E9b=P8c;E9b+=q8c;E9b+=a8c;var D9b=k9c;D9b+=n8c;D9b+=R5l.e2c;var Z9b=m9c;Z9b+=V9c;Z9b+=Z9c;Z9b+=D9c;var J2b=a2c;J2b+=Z9c;J2b+=G2c;J2b+=o8c;var o2b=G8c;o2b+=u8c;var n2b=X8c;n2b+=H8c;var M5b=J8c;M5b+=M8c;var O5b=k8c;O5b+=R5l.g2c;O5b+=l8c;O5b+=F7c;var H6b=k9c;H6b+=W7c;H6b+=G2c;var X6b=L7c;X6b+=b7c;X6b+=R5l.Y2c;var q6b=R7c;q6b+=g7c;var h6b=x7c;h6b+=y7c;h6b+=Y7c;var c6b=L7c;c6b+=m7c;c6b+=H8c;var V6b=V7c;V6b+=Z7c;V6b+=R5l.Y2c;var k3b=V7c;k3b+=D7c;var J3b=a2c;J3b+=f7c;J3b+=R5l.Y2c;var I3b=E7c;I3b+=c7c;I3b+=h7c;var a0b=a2c;a0b+=Z9c;a0b+=Z7c;a0b+=R5l.Y2c;var T0b=k9c;T0b+=N7c;T0b+=A7c;var O0b=a2c;O0b+=e7c;O0b+=Z9c;O0b+=D9c;var Q0b=B7c;Q0b+=i7c;var S0b=m9c;S0b+=t7c;S0b+=K7c;S0b+=D9c;var K0b=C7c;K0b+=z7c;K0b+=r7c;K0b+=U7c;var h0b=L7c;h0b+=m7c;h0b+=H8c;var H1U=k9c;H1U+=R5l.Y2c;H1U+=R5l.x2c;H1U+=l8c;var r1U=d7c;r1U+=p7c;var i1U=w7c;i1U+=s7c;i1U+=S7c;var B1U=a2c;B1U+=e7c;B1U+=m7c;B1U+=H8c;var h1U=Q7c;h1U+=v7c;h1U+=O7c;var c1U=m9c;c1U+=T7c;c1U+=R5l.Y2c;var Y1U=j7c;Y1U+=Z9c;Y1U+=R5l.z2c;Y1U+=R5l.Y2c;var l4U=j7c;l4U+=I7c;var k4U=m9c;k4U+=t7c;k4U+=Z7c;k4U+=R5l.Y2c;var u4U=m9c;u4U+=P7c;var I4U=q7c;I4U+=H2c;var Y4U=a2c;Y4U+=a7c;Y4U+=H8c;var F4U=V7c;F4U+=n7c;F4U+=H8c;var I8U=o7c;I8U+=G7c;I8U+=u7c;I8U+=D8c;var v9U=R5l.A2c;v9U+=D8c;v9U+=Z9c;v9U+=D8c;var d9U=X7c;d9U+=H7c;d9U+=J7c;d9U+=M7c;var U9U=R5l.m2c;U9U+=k7c;U9U+=l7c;U9U+=M7c;var K9U=F4c;K9U+=M7c;var B9U=W4c;B9U+=L4c;B9U+=g8c;B9U+=b4c;var R9U=R4c;R9U+=g4c;var G2U=R5l.z2c;G2U+=x4c;G2U+=y4c;G2U+=G2c;var o2U=Y4c;o2U+=R5l.Y2c;var a2U=R5l.z2c;a2U+=f8c;a2U+=Z9c;a2U+=m4c;var q2U=L7c;q2U+=e7c;q2U+=R5l.e2c;q2U+=H8c;var h2U=P9c;h2U+=R5l.x2c;h2U+=R5l.A2c;var c2U=V7c;c2U+=V4c;c2U+=g4c;var b2U=Z9c;b2U+=m9c;b2U+=R5l.Y2c;b2U+=H2c;var F2U=Z9c;F2U+=R5l.m2c;F2U+=R5l.m2c;var o5U=A9c;o5U+=G2c;o5U+=Z4c;o5U+=D4c;var n5U=f4c;n5U+=D9c;var T5U=E4c;T5U+=c4c;var O5U=m9c;O5U+=D8c;O5U+=h4c;O5U+=D9c;var Q5U=R5l.g2c;Q5U+=N4c;Q5U+=R5l.Y2c;var n6U=A4c;n6U+=e4c;var a6U=R4c;a6U+=g4c;var O6U=f9c;O6U+=B4c;O6U+=i4c;O6U+=P9c;var v6U=m9c;v6U+=P7c;var w6U=t4c;w6U+=R5l.Y2c;var z6U=m9c;z6U+=T7c;z6U+=R5l.Y2c;var C6U=R5l.m2c;C6U+=f9c;C6U+=K4c;var K6U=m9c;K6U+=C4c;K6U+=D9c;var t6U=L7c;t6U+=Z9c;t6U+=z4c;t6U+=H8c;var i6U=r4c;i6U+=R5l.Y2c;i6U+=L9c;i6U+=U4c;var B6U=a2c;B6U+=n2c;var N6U=V7c;N6U+=G2c;N6U+=o8c;var V6U=R5l.Y2c;V6U+=d4c;var b6U=m9c;b6U+=p4c;b6U+=g4c;var W6U=w4c;W6U+=s4c;var l3U=V7c;l3U+=G2c;l3U+=m7c;l3U+=H8c;var J3U=a2c;J3U+=Z9c;J3U+=D7c;var h3U=S4c;h3U+=Q4c;var l0U=v4c;l0U+=D8c;l0U+=R5l.Y2c;l0U+=O4c;var k0U=a2c;k0U+=Z9c;k0U+=D7c;var M0U=v4c;M0U+=L9c;M0U+=Z9c;M0U+=T4c;var J0U=f4c;J0U+=D9c;var a0U=f4c;a0U+=z4c;a0U+=H8c;var z0U=a2c;z0U+=n2c;var L0U=R4c;L0U+=g4c;var Z15=j4c;Z15+=I4c;Z15+=m8c;var V15=Y4c;V15+=R5l.Y2c;var n45=R5l.R2c;n45+=R5l.x2c;n45+=R5l.x2c;var h85=R5l.m2c;h85+=H2c;var d25=D8c;d25+=Z9c;d25+=m4c;var U25=R5l.R2c;U25+=L9c;U25+=L9c;var r25=N7c;r25+=A7c;var z25=v4c;z25+=L9c;z25+=P4c;z25+=R5l.Y2c;var C25=q4c;C25+=Z9c;C25+=R5l.z2c;C25+=R5l.Y2c;var K25=a4c;K25+=T4c;var t25=n4c;t25+=R5l.g2c;t25+=l8c;var i25=o4c;i25+=L9c;i25+=R5l.z2c;var B25=G4c;B25+=u4c;B25+=X4c;var e25=H4c;e25+=J4c;var A25=M4c;A25+=R5l.Y2c;A25+=k4c;var N25=l4c;N25+=R5l.x2c;var h25=R5l.z2c;h25+=F1c;h25+=R5l.z2c;var c25=R5l.g2c;c25+=Z9c;c25+=R5l.x2c;c25+=W1c;var E25=l4c;E25+=R5l.x2c;var f25=R5l.x2c;f25+=L1c;f25+=b1c;f25+=R5l.z2c;var g65=X8c;g65+=H8c;var q05=Z8c;q05+=R1c;var r05=g1c;r05+=D8c;var z05=R5l.m2c;z05+=H2c;var C05=x1c;C05+=P9c;var t05=y1c;t05+=Y1c;var i05=R5l.m2c;i05+=H2c;'use strict';(function(){var O1c=' remaining';var S1c=' day';var s1c="log";var w1c="les Editor trial info - ";var d1c='Editor - Trial expired';var U1c="trying DataTables Editor\n\n";var r1c="or ";var z1c="Thank you f";var C1c="expired. To purchase a license ";var K1c="w ";var t1c="r trial has no";var i1c="You";var B1c="et/purchase";var e1c="for Editor, please see https://editor.datatables.n";var A1c="getTime";var N1c="f958";var h1c="ceil";var c1c="6";var f1c="c5";var Z1c="3";var m1c="xpiredWarning";var b2c=2325696898;var L2c=1525305600;var F2c=6765;var l5c=1000;var A05=R5l.Y2c;A05+=m1c;var f05=V1c;f05+=R5l.p2c;f05+=Z1c;f05+=R5l.x2c;var D05=D1c;D05+=G2c;D05+=r9c;D05+=Y9c;var Z05=Z1c;Z05+=V1c;Z05+=f1c;var V05=V1c;V05+=E1c;V05+=c1c;V05+=R5l.x2c;R5l.N1=function(h1){if(R5l&&h1)return R5l.c3(h1);};R5l.v4=function(Q4){if(R5l)return R5l.h3(Q4);};var remaining=Math[h1c]((new Date((R5l.F4(V05)?b2c:L2c)*(R5l.v4(Z05)?l5c:F2c))[R5l.N1(N1c)?D05:R5l.E2c]()-new Date()[R5l.F05(f05)?R5l.E2c:A1c]())/(l5c*G5c*G5c*Q5c));if(remaining<=A5c){var h05=e1c;h05+=B1c;var c05=i1c;c05+=t1c;c05+=K1c;c05+=C1c;var E05=z1c;E05+=r1c;E05+=U1c;alert(E05+c05+h05);throw d1c;}else if(remaining<=K5c){var N05=p1c;N05+=R5l.p2c;N05+=w1c;console[s1c](N05+remaining+S1c+(remaining===e5c?Q1c:v1c)+O1c);}window[A05]=function(){var n1c='Your trial has now expired. To purchase a license ';var a1c="r trying DataTables Editor\n\n";var q1c=" you fo";var P1c="hank";var I1c="tables.net/purchase";var j1c="itor.data";var T1c="for Editor, please see https://ed";var B05=T1c;B05+=j1c;B05+=I1c;var e05=r9c;e05+=P1c;e05+=q1c;e05+=a1c;alert(e05+n1c+B05);};}());var DataTable=$[i05][o1c];if(!DataTable||!DataTable[t05]||!DataTable[G1c](u1c)){throw X1c;}var Editor=function(opts){var M1c="DataTables Editor must be initialised as a 'new' instance'";var J1c="uct";var H1c="_constr";var K05=H1c;K05+=J1c;K05+=P9c;if(!(this instanceof Editor)){alert(M1c);}this[K05](opts);};DataTable[C05]=Editor;$[z05][k1c][r05]=Editor;var _editor_el=function(dis,ctx){var W0R="-dte-e=\"";var l1c="*[d";var U05=l1c;U05+=F0R;U05+=W0R;if(ctx===undefined){ctx=document;}return $(U05+dis+L0R,ctx);};var __inlineCounter=A5c;var _pluck=function(a,prop){var d05=I8c;d05+=v4c;d05+=f8c;var out=[];$[d05](a,function(idx,el){var p05=b0R;p05+=R5l.z2c;p05+=f8c;out[p05](el[prop]);});return out;};var _api_file=function(name,id){var m0R="file id ";var Y0R="Unknown ";var y0R="ble ";var x0R=" ta";var w05=r4c;w05+=K4c;var table=this[w05](name);var file=table[id];if(!file){var S05=R0R;S05+=g0R;S05+=x0R;S05+=y0R;var s05=Y0R;s05+=m0R;throw s05+id+S05+name;}return table[id];};var _api_files=function(name){var D0R="le name: ";var Z0R="Unknown file tab";var Q05=R5l.m2c;Q05+=f9c;Q05+=L9c;Q05+=H7c;if(!name){return Editor[V0R];}var table=Editor[Q05][name];if(!table){var v05=Z0R;v05+=D0R;throw v05+name;}return table;};var _objectKeys=function(o){var f0R="asOwnProperty";var out=[];for(var key in o){var O05=f8c;O05+=f0R;if(o[O05](key)){out[E0R](key);}}return out;};var _deepCompare=function(o1,o2){var N0R="ob";var P05=R5l.w2c;P05+=c0R;P05+=G2c;P05+=f8c;var I05=L9c;I05+=h0R;var j05=N0R;j05+=A0R;j05+=R5l.Y2c;j05+=e0R;var T05=N0R;T05+=B0R;if(typeof o1!==T05||typeof o2!==j05){return o1==o2;}var o1Props=_objectKeys(o1);var o2Props=_objectKeys(o2);if(o1Props[I05]!==o2Props[i0R]){return t0R;}for(var i=A5c,ien=o1Props[P05];i<ien;i++){var propName=o1Props[i];if(typeof o1[propName]===R5l.K2c){if(!_deepCompare(o1[propName],o2[propName])){return t0R;}}else if(o1[propName]!=o2[propName]){return t0R;}}return K0R;};Editor[q05]=function(opts,classes,host){var F5R="multiReturn";var G6R='multi-info';var n6R="none";var P6R="control";var I6R="input-";var T6R="prep";var Q6R="fieldInfo";var s6R='msg-error';var w6R='<div data-dte-e="msg-multi" class="';var K6R='<div data-dte-e="input" class="';var B6R='<div data-dte-e="msg-label" class="';var A6R='<label data-dte-e="label" class="';var h6R="namePrefix";var c6R="typePrefix";var D6R="_fnSetObjectDataFn";var b6R="eld_";var l3R="eld - unknown field type ";var k3R="ng f";var M3R="Error addi";var G3R="aul";var o3R="ldTypes";var P3R="aProp";var O3R="alFro";var v3R="lToData";var S3R="v c";var d3R="=";var U3R=" for";var C3R="msg-l";var K3R="belInfo";var i3R="ontrol\" class=\"";var B3R="-e=\"input-c";var e3R="<div data-dte";var N3R=" c";var h3R="ta-dte-e=\"multi-value\"";var c3R="<div da";var E3R="Valu";var f3R="lti";var D3R="\"multi-info\"";var Z3R=" data-dte-e=";var V3R="<span";var m3R="estore";var Y3R="multiR";var y3R="rest";var x3R="\" class=\"";var g3R="<div data-dte-e=\"msg-error";var R3R="\"></div";var L3R="<div data-dte-e=\"msg-message\"";var W3R="msg-mes";var F3R="div>";var M0R="-e=\"msg-info\" class=\"";var H0R="<div data-";var X0R="msg-inf";var a0R="eFn";var q0R="_typ";var P0R="ode";var T0R="-cont";var Q0R="sg-inf";var S0R="-label";var w0R="-m";var p0R="msg";var U0R="lti-v";var z0R="sg-m";var b65=C0R;b65+=f8c;var L65=R5l.x2c;L65+=Z9c;L65+=R5l.g2c;var l35=v4c;l35+=P8c;l35+=Y1c;var k35=Z9c;k35+=H2c;var M35=E4c;M35+=L9c;M35+=G2c;M35+=f9c;var J35=R5l.x2c;J35+=Z9c;J35+=R5l.g2c;var H35=R5l.g2c;H35+=z0R;H35+=r0R;var X35=E4c;X35+=U0R;X35+=d0R;var u35=p0R;u35+=w0R;u35+=s0R;u35+=R5l.Y2c;var G35=p0R;G35+=S0R;var o35=R5l.g2c;o35+=Q0R;o35+=Z9c;var n35=L9c;n35+=v0R;n35+=R5l.Y2c;n35+=L9c;var a35=O0R;a35+=T0R;a35+=j0R;var q35=R5l.x2c;q35+=I0R;var P35=R5l.g2c;P35+=P0R;P35+=L9c;P35+=R5l.z2c;var O35=q0R;O35+=a0R;var v35=n0R;v35+=o0R;var Q35=G0R;Q35+=u0R;var S35=X0R;S35+=Z9c;var s35=H0R;s35+=J0R;s35+=M0R;var w35=k0R;w35+=l0R;w35+=F3R;var p35=G0R;p35+=u0R;var d35=W3R;d35+=R5l.z2c;d35+=R5l.R2c;d35+=D1c;var U35=L3R;U35+=b3R;var r35=R3R;r35+=u0R;var z35=g3R;z35+=x3R;var C35=y3R;C35+=Z9c;C35+=D8c;C35+=R5l.Y2c;var K35=Y3R;K35+=m3R;var t35=V3R;t35+=Z3R;t35+=D3R;t35+=b3R;var i35=G2c;i35+=f9c;i35+=G2c;i35+=R5l.w2c;var B35=G0R;B35+=u0R;var e35=E4c;e35+=f3R;e35+=E3R;e35+=R5l.Y2c;var A35=c3R;A35+=h3R;A35+=N3R;A35+=A3R;var N35=e3R;N35+=B3R;N35+=i3R;var h35=G0R;h35+=u0R;var c35=t3R;c35+=K3R;var E35=G0R;E35+=u0R;var f35=C3R;f35+=R5l.R2c;f35+=R5l.p2c;f35+=z3R;var D35=L9c;D35+=R5l.R2c;D35+=r3R;var Z35=G0R;Z35+=u0R;var V35=G0R;V35+=U3R;V35+=d3R;V35+=G0R;var m35=t3R;m35+=p3R;m35+=L9c;var Y35=G0R;Y35+=u0R;var y35=w3R;y35+=R5l.g2c;y35+=R5l.Y2c;var x35=s3R;x35+=S3R;x35+=A3R;var g35=Q3R;g35+=R5l.R2c;g35+=v3R;var b35=Q3R;b35+=O3R;b35+=R5l.g2c;b35+=T3R;var L35=R5l.Y2c;L35+=a8c;L35+=G2c;var W35=R5l.x2c;W35+=R5l.R2c;W35+=j3R;var l05=I3R;l05+=G2c;l05+=P3R;var J05=H2c;J05+=q3R;J05+=R5l.Y2c;var H05=G2c;H05+=R5l.e2c;H05+=H8c;var X05=r4c;X05+=E9c;X05+=R5l.z2c;var u05=Z8c;u05+=a3R;u05+=R5l.x2c;var n05=n3R;n05+=o3R;var a05=F9c;a05+=G3R;a05+=G2c;a05+=R5l.z2c;var that=this;var multiI18n=host[u3R][X3R];opts=$[H3R](K0R,{},Editor[J3R][a05],opts);if(!Editor[n05][opts[D9c]]){var G05=G2c;G05+=R5l.e2c;G05+=H8c;var o05=M3R;o05+=k3R;o05+=f9c;o05+=l3R;throw o05+opts[G05];}this[R5l.z2c]=$[H3R]({},Editor[u05][F6R],{type:Editor[X05][opts[H05]],name:opts[J05],classes:classes,host:host,opts:opts,multiValue:t0R});if(!opts[W6R]){var k05=T9c;k05+=k9c;k05+=L6R;k05+=b6R;var M05=f9c;M05+=R5l.x2c;opts[M05]=k05+opts[R6R];}if(opts[l05]){var F35=J2c;F35+=P3R;opts[g6R]=opts[F35];}if(opts[W35]===Q1c){opts[g6R]=opts[R6R];}var dtPrivateApi=DataTable[L35][x6R];this[b35]=function(d){var Z6R='editor';var m6R="ectData";var Y6R="nGetObj";var R35=y6R;R35+=Y6R;R35+=m6R;R35+=V6R;return dtPrivateApi[R35](opts[g6R])(d,Z6R);};this[g35]=dtPrivateApi[D6R](opts[g6R]);var template=$(x35+classes[f6R]+E6R+classes[c6R]+opts[D9c]+E6R+classes[h6R]+opts[y35]+E6R+opts[N6R]+Y35+A6R+classes[m35]+V35+Editor[e6R](opts[W6R])+Z35+opts[D35]+B6R+classes[f35]+E35+opts[c35]+i6R+t6R+K6R+classes[O0R]+h35+N35+classes[C6R]+z6R+A35+classes[e35]+B35+multiI18n[i35]+t35+classes[r6R]+U6R+multiI18n[d6R]+p6R+i6R+w6R+classes[K35]+U6R+multiI18n[C35]+i6R+z35+classes[s6R]+r35+U35+classes[d35]+p35+opts[S6R]+w35+s35+classes[S35]+Q35+opts[Q6R]+i6R+v35+i6R);var input=this[O35](v6R,opts);if(input!==O6R){var j35=T6R;j35+=j6R;j35+=R5l.x2c;var T35=I6R;T35+=P6R;_editor_el(T35,template)[j35](input);}else{var I35=q6R;I35+=R5l.e2c;template[a6R](I35,n6R);}this[o6R]=$[H3R](K0R,{},Editor[J3R][P35][q35],{container:template,inputControl:_editor_el(a35,template),label:_editor_el(n35,template),fieldInfo:_editor_el(o35,template),labelInfo:_editor_el(G35,template),fieldError:_editor_el(s6R,template),fieldMessage:_editor_el(u35,template),multi:_editor_el(X35,template),multiReturn:_editor_el(H35,template),multiInfo:_editor_el(G6R,template)});this[J35][M35][k35](l35,function(){var X6R="sable";var F65=u6R;F65+=X6R;F65+=R5l.x2c;if(that[R5l.z2c][H6R][J6R]&&!template[M6R](classes[F65])&&opts[D9c]!==k6R){var W65=l6R;W65+=L9c;that[W65](Q1c);}});this[L65][F5R][W5R](L5R,function(){var b5R="multiRestore";that[b5R]();});$[b65](this[R5l.z2c][D9c],function(name,fn){if(typeof fn===R5R&&that[name]===undefined){that[name]=function(){var g5R="_type";var R65=g5R;R65+=Z8c;R65+=H2c;var args=Array[x5R][y5R][Y5R](arguments);args[m5R](name);var ret=that[R65][V5R](that,args);return ret===undefined?that:ret;};}});};Editor[J3R][g65]={def:function(set){var c5R="ul";var E5R="efaul";var D5R="sFunc";var x65=Z5R;x65+=G2c;x65+=R5l.z2c;var opts=this[R5l.z2c][x65];if(set===undefined){var m65=f9c;m65+=D5R;m65+=f5R;m65+=H2c;var Y65=R5l.x2c;Y65+=E5R;Y65+=G2c;var y65=F9c;y65+=R5l.R2c;y65+=c5R;y65+=G2c;var def=opts[y65]!==undefined?opts[Y65]:opts[F9c];return $[m65](def)?def():def;}opts[F9c]=set;return this;},disable:function(){var C5R='disable';var t5R="ntainer";var B5R="sse";var N5R="ypeFn";var h5R="_t";var f65=h5R;f65+=N5R;var D65=A5R;D65+=R5l.p2c;D65+=e5R;var Z65=v4c;Z65+=t3R;Z65+=B5R;Z65+=R5l.z2c;var V65=i5R;V65+=t5R;this[o6R][V65][K5R](this[R5l.z2c][Z65][D65]);this[f65](C5R);return this;},displayed:function(){var N65=z5R;N65+=R5l.Y2c;var h65=r5R;h65+=R5l.z2c;var c65=U5R;c65+=R5l.R2c;c65+=d5R;var E65=R5l.x2c;E65+=Z9c;E65+=R5l.g2c;var container=this[E65][c65];return container[h65](p5R)[i0R]&&container[a6R](w5R)!=N65?K0R:t0R;},enable:function(){var v5R="emoveC";var Q5R="lasses";var S5R="isabled";var s5R="typeF";var t65=j6R;t65+=v0R;t65+=L9c;t65+=R5l.Y2c;var i65=k9c;i65+=s5R;i65+=H2c;var B65=R5l.x2c;B65+=S5R;var e65=v4c;e65+=Q5R;var A65=D8c;A65+=v5R;A65+=O5R;this[o6R][T5R][A65](this[R5l.z2c][e65][B65]);this[i65](t65);return this;},enabled:function(){var P5R="conta";var I5R="sses";var C65=j5R;C65+=I5R;var K65=P5R;K65+=q5R;K65+=D8c;return this[o6R][K65][M6R](this[R5l.z2c][C65][a5R])===t0R;},error:function(msg,fn){var l5R='errorMessage';var n5R="ms";var d65=k9c;d65+=n5R;d65+=o5R;var classes=this[R5l.z2c][G5R];if(msg){var z65=u5R;z65+=X5R;this[o6R][T5R][z65](classes[H5R]);}else{var U65=R5l.A2c;U65+=J5R;var r65=R5l.x2c;r65+=I0R;this[r65][T5R][M5R](classes[U65]);}this[k5R](l5R,msg);return this[d65](this[o6R][F2R],msg,fn);},fieldInfo:function(msg){var w65=n3R;w65+=W2R;w65+=L2R;var p65=R5l.x2c;p65+=Z9c;p65+=R5l.g2c;return this[b2R](this[p65][w65],msg);},isMultiValue:function(){var R2R="Ids";var s65=R5l.g2c;s65+=r0R;s65+=R2R;return this[R5l.z2c][g2R]&&this[R5l.z2c][s65][i0R]!==e5c;},inError:function(){var x2R="asse";var S65=q4c;S65+=x2R;S65+=R5l.z2c;return this[o6R][T5R][M6R](this[R5l.z2c][S65][H5R]);},input:function(){var m2R='input, select, textarea';var Q65=f9c;Q65+=y2R;return this[R5l.z2c][D9c][Q65]?this[k5R](Y2R):$(m2R,this[o6R][T5R]);},focus:function(){var c2R="elect, textarea";var E2R=", s";var O65=V2R;O65+=v4c;O65+=A7c;var v65=Z2R;v65+=R5l.Y2c;if(this[R5l.z2c][v65][O65]){var T65=R5l.m2c;T65+=D2R;T65+=E8c;T65+=R5l.z2c;this[k5R](T65);}else{var I65=R5l.x2c;I65+=Z9c;I65+=R5l.g2c;var j65=g0R;j65+=f2R;j65+=E2R;j65+=c2R;$(j65,this[I65][T5R])[h2R]();}return this;},get:function(){var N2R="isMultiVal";var a65=R5l.x2c;a65+=L1c;var q65=o5R;q65+=D4c;var P65=N2R;P65+=A2R;if(this[P65]()){return undefined;}var val=this[k5R](q65);return val!==undefined?val:this[a65]();},hide:function(animate){var C2R="deUp";var t2R="tainer";var G65=e2R;G65+=B2R;G65+=R5l.e2c;var o65=i2R;o65+=t2R;var n65=R5l.x2c;n65+=Z9c;n65+=R5l.g2c;var el=this[n65][o65];if(animate===undefined){animate=K0R;}if(this[R5l.z2c][K2R][G65]()&&animate){var u65=R5l.z2c;u65+=P8c;u65+=C2R;el[u65]();}else{var H65=z5R;H65+=R5l.Y2c;var X65=e2R;X65+=z2R;el[a6R](X65,H65);}return this;},label:function(str){var p2R="labelI";var W55=r2R;W55+=U2R;var F55=d2R;F55+=R5l.g2c;F55+=L9c;var l65=R5l.x2c;l65+=D4c;l65+=R5l.R2c;l65+=b8c;var k65=p2R;k65+=w2R;var M65=R5l.x2c;M65+=Z9c;M65+=R5l.g2c;var J65=t3R;J65+=r3R;var label=this[o6R][J65];var labelInfo=this[M65][k65][l65]();if(str===undefined){return label[s2R]();}label[F55](str);label[W55](labelInfo);return this;},labelInfo:function(msg){var S2R="abelI";var b55=L9c;b55+=S2R;b55+=w2R;var L55=R5l.x2c;L55+=Z9c;L55+=R5l.g2c;return this[b2R](this[L55][b55],msg);},message:function(msg,fn){var Q2R="ldMessa";var g55=n3R;g55+=Q2R;g55+=o5R;g55+=R5l.Y2c;var R55=v2R;R55+=R5l.g2c;return this[b2R](this[R55][g55],msg,fn);},multiGet:function(id){var j2R="iV";var O2R="isMu";var x55=O2R;x55+=T2R;x55+=j2R;x55+=d0R;var value;var multiValues=this[R5l.z2c][I2R];var multiIds=this[R5l.z2c][P2R];if(id===undefined){value={};for(var i=A5c;i<multiIds[i0R];i++){value[multiIds[i]]=this[q2R]()?multiValues[multiIds[i]]:this[a2R]();}}else if(this[x55]()){value=multiValues[id];}else{value=this[a2R]();}return value;},multiRestore:function(){this[R5l.z2c][g2R]=K0R;this[n2R]();},multiSet:function(id,val){var multiValues=this[R5l.z2c][I2R];var multiIds=this[R5l.z2c][P2R];if(val===undefined){val=id;id=undefined;}var set=function(idSrc,val){if($[o2R](multiIds)===-e5c){multiIds[E0R](idSrc);}multiValues[idSrc]=val;};if($[G2R](val)&&id===undefined){$[u2R](val,function(idSrc,innerVal){set(idSrc,innerVal);});}else if(id===undefined){var y55=R5l.Y2c;y55+=R5l.R2c;y55+=v4c;y55+=f8c;$[y55](multiIds,function(i,idSrc){set(idSrc,val);});}else{set(id,val);}this[R5l.z2c][g2R]=K0R;this[n2R]();return this;},name:function(){var Y55=H2c;Y55+=R5l.R2c;Y55+=R5l.g2c;Y55+=R5l.Y2c;return this[R5l.z2c][H6R][Y55];},node:function(){var m55=i5R;m55+=H2c;m55+=X2R;m55+=R5l.A2c;return this[o6R][m55][A5c];},set:function(val,multiCheck){var f9R="_multiValueChe";var D9R='set';var m9R="entityDecode";var c55=H2R;c55+=J2R;var f55=Z5R;f55+=G2c;f55+=R5l.z2c;var decodeFn=function(d){var Y9R='\n';var y9R='\'';var x9R='"';var R9R='<';var L9R='>';var D55=M2R;D55+=R5l.R2c;D55+=v4c;D55+=R5l.Y2c;var Z55=k2R;Z55+=L9c;Z55+=l2R;Z55+=R5l.Y2c;var V55=M2R;V55+=F9R;return typeof d!==W9R?d:d[V55](/&gt;/g,L9R)[b9R](/&lt;/g,R9R)[Z55](/&amp;/g,g9R)[D55](/&quot;/g,x9R)[b9R](/&#39;/g,y9R)[b9R](/&#10;/g,Y9R);};this[R5l.z2c][g2R]=t0R;var decode=this[R5l.z2c][f55][m9R];if(decode===undefined||decode===K0R){if($[V9R](val)){var E55=Z9R;E55+=f8c;for(var i=A5c,ien=val[E55];i<ien;i++){val[i]=decodeFn(val[i]);}}else{val=decodeFn(val);}}this[c55](D9R,val);if(multiCheck===undefined||multiCheck===K0R){var h55=f9R;h55+=Y1c;this[h55]();}return this;},show:function(animate){var c9R="ntai";var B55=w4c;B55+=R5l.R2c;B55+=R5l.e2c;var e55=E9R;e55+=G2c;var A55=i5R;A55+=c9R;A55+=h9R;var N55=R5l.x2c;N55+=Z9c;N55+=R5l.g2c;var el=this[N55][A55];if(animate===undefined){animate=K0R;}if(this[R5l.z2c][e55][B55]()&&animate){el[N9R]();}else{var K55=R5l.p2c;K55+=A9R;K55+=v4c;K55+=e9R;var t55=e2R;t55+=B9R;t55+=R5l.R2c;t55+=R5l.e2c;var i55=v4c;i55+=R5l.z2c;i55+=R5l.z2c;el[i55](t55,K55);}return this;},val:function(val){var C55=o5R;C55+=D4c;return val===undefined?this[C55]():this[G4c](val);},compare:function(value,original){var i9R="mpare";var z55=i5R;z55+=i9R;var compare=this[R5l.z2c][H6R][z55]||_deepCompare;return compare(value,original);},dataSrc:function(){var r55=R5l.x2c;r55+=F0R;return this[R5l.z2c][H6R][r55];},destroy:function(){var K9R='destroy';var U55=H2R;U55+=J2R;this[o6R][T5R][t9R]();this[U55](K9R);return this;},multiEditable:function(){var C9R="ltiEditable";var d55=E4c;d55+=C9R;return this[R5l.z2c][H6R][d55];},multiIds:function(){var z9R="tiI";var p55=A9c;p55+=z9R;p55+=U4c;return this[R5l.z2c][p55];},multiInfoShown:function(show){var s55=H2c;s55+=Z9c;s55+=e4c;var w55=R5l.x2c;w55+=I0R;this[w55][r6R][a6R]({display:show?r9R:s55});},multiReset:function(){this[R5l.z2c][P2R]=[];this[R5l.z2c][I2R]={};},valFromData:O6R,valToData:O6R,_errorNode:function(){return this[o6R][F2R];},_msg:function(el,msg,fn){var Q9R="ideU";var p9R="ible";var U9R=":v";var O55=U9R;O55+=d9R;O55+=p9R;var S55=R5l.m2c;S55+=w9R;if(msg===undefined){return el[s2R]();}if(typeof msg===S55){var v55=P2c;v55+=m9c;v55+=f9c;var Q55=f8c;Q55+=Z9c;Q55+=R5l.z2c;Q55+=G2c;var editor=this[R5l.z2c][Q55];msg=msg(editor,new DataTable[v55](editor[R5l.z2c][s9R]));}if(el[r5R]()[d9R](O55)){var T55=f8c;T55+=G2c;T55+=R5l.g2c;T55+=L9c;el[T55](msg);if(msg){el[N9R](fn);}else{var j55=S9R;j55+=Q9R;j55+=m9c;el[j55](fn);}}else{var a55=v9R;a55+=H2c;a55+=R5l.Y2c;var q55=R5l.p2c;q55+=A9R;q55+=v4c;q55+=e9R;var P55=v4c;P55+=R5l.z2c;P55+=R5l.z2c;var I55=d2R;I55+=R5l.g2c;I55+=L9c;el[I55](msg||Q1c)[P55](w5R,msg?q55:a55);if(fn){fn();}}return this;},_multiValueCheck:function(){var X9R="toggleClass";var u9R="noMulti";var G9R="ock";var n9R="tiIds";var q9R="Retu";var P9R="lock";var I9R="ultiInf";var O9R="ultiNoE";var y25=f8c;y25+=Z9c;y25+=R5l.z2c;y25+=G2c;var x25=R5l.g2c;x25+=O9R;x25+=u6R;x25+=G2c;var g25=T9R;g25+=R5l.z2c;g25+=H7c;var R25=f9c;R25+=H2c;R25+=V2R;var b25=f8c;b25+=G2c;b25+=j9R;var L25=R5l.g2c;L25+=I9R;L25+=Z9c;var W25=E9R;W25+=G2c;var F25=H2c;F25+=Z9c;F25+=H2c;F25+=R5l.Y2c;var l55=R5l.p2c;l55+=P9R;var k55=Z9R;k55+=f8c;var M55=v4c;M55+=R5l.z2c;M55+=R5l.z2c;var J55=X3R;J55+=q9R;J55+=a9R;var n55=A9c;n55+=n9R;var last;var ids=this[R5l.z2c][n55];var values=this[R5l.z2c][I2R];var isMultiValue=this[R5l.z2c][g2R];var isMultiEditable=this[R5l.z2c][H6R][J6R];var val;var different=t0R;if(ids){for(var i=A5c;i<ids[i0R];i++){val=values[ids[i]];if(i>A5c&&!_deepCompare(val,last)){different=K0R;break;}last=val;}}if(different&&isMultiValue||!isMultiEditable&&this[q2R]()){var u55=o9R;u55+=G9R;var G55=v9R;G55+=e4c;var o55=v4c;o55+=R5l.z2c;o55+=R5l.z2c;this[o6R][C6R][o55]({display:G55});this[o6R][X3R][a6R]({display:u55});}else{var X55=H2c;X55+=Z9c;X55+=H2c;X55+=R5l.Y2c;this[o6R][C6R][a6R]({display:r9R});this[o6R][X3R][a6R]({display:X55});if(isMultiValue&&!different){var H55=R5l.z2c;H55+=R5l.Y2c;H55+=G2c;this[H55](last,t0R);}}this[o6R][J55][M55]({display:ids&&ids[k55]>e5c&&different&&!isMultiValue?l55:F25});var i18n=this[R5l.z2c][W25][u3R][X3R];this[o6R][L25][b25](isMultiEditable?i18n[R25]:i18n[u9R]);this[o6R][X3R][X9R](this[R5l.z2c][g25][x25],!isMultiEditable);this[R5l.z2c][y25][H9R]();return K0R;},_typeFn:function(name){var M9R="hift";var J9R="unsh";var D25=z4c;D25+=H8c;var Z25=Z9c;Z25+=m9c;Z25+=G2c;Z25+=R5l.z2c;var V25=J9R;V25+=f9c;V25+=R5l.m2c;V25+=G2c;var m25=R5l.z2c;m25+=M9R;var Y25=k9R;Y25+=l9R;var args=Array[x5R][y5R][Y25](arguments);args[m25]();args[V25](this[R5l.z2c][Z25]);var fn=this[R5l.z2c][D25][name];if(fn){return fn[V5R](this[R5l.z2c][K2R],args);}}};Editor[J3R][F8R]={};Editor[J3R][f25]={"className":R5l.E2c,"data":R5l.E2c,"def":R5l.E2c,"fieldInfo":R5l.E2c,"id":R5l.E2c,"label":R5l.E2c,"labelInfo":R5l.E2c,"name":O6R,"type":W8R,"message":R5l.E2c,"multiEditable":K0R};Editor[E25][c25][h25]={type:O6R,name:O6R,classes:O6R,opts:O6R,host:O6R};Editor[N25][A25][o6R]={container:O6R,label:O6R,labelInfo:O6R,fieldInfo:O6R,fieldError:O6R,fieldMessage:O6R};Editor[F8R]={};Editor[e25][L8R]={"init":function(dte){},"open":function(dte,append,fn){},"close":function(dte,fn){}};Editor[F8R][b8R]={"create":function(conf){},"get":function(conf){},"set":function(conf,val){},"enable":function(conf){},"disable":function(conf){}};Editor[F8R][B25]={"ajaxUrl":O6R,"ajax":O6R,"dataSource":O6R,"domTable":O6R,"opts":O6R,"displayController":O6R,"fields":{},"order":[],"id":-e5c,"displayed":t0R,"processing":t0R,"modifier":O6R,"action":O6R,"idSrc":O6R,"unique":A5c};Editor[i25][R8R]={"label":O6R,"fn":O6R,"className":O6R};Editor[F8R][g8R]={onReturn:t25,onBlur:K25,onBackground:x8R,onComplete:C25,onEsc:z25,onFieldError:r25,submit:U25,focus:A5c,buttons:K0R,title:K0R,message:K0R,drawType:t0R,scope:d25};Editor[y8R]={};(function(window,document,$,DataTable){var R1R='<div class="DTED_Lightbox_Close"></div>';var b1R='<div class="DTED_Lightbox_Content_Wrapper">';var L1R='<div class="DTED DTED_Lightbox_Wrapper">';var S7R='div.DTE_Footer';var w7R="stop";var l8R="bi";var J8R="Top";var e8R="lightbox";var A8R="Controller";var N8R="ontainer\">";var h8R="<div class=\"DTED_Lightbox_C";var c8R="nt\">";var E8R="<div class=\"DTED_Lightbox_Conte";var Z8R="div/></div>";var V8R="=\"DTED_Lightbox_Background\"><";var m8R="<div clas";var v5c=25;var c85=u6R;c85+=Y8R;var E85=m8R;E85+=R5l.z2c;E85+=V8R;E85+=Z8R;var f85=D8R;f85+=f8R;var D85=E8R;D85+=c8R;var Z85=h8R;Z85+=N8R;var w25=y8R;w25+=A8R;var p25=H4c;p25+=S4c;p25+=L9c;p25+=R5l.z2c;var self;Editor[y8R][e8R]=$[H3R](K0R,{},Editor[p25][w25],{"init":function(dte){var i8R="nit";var s25=B8R;s25+=i8R;self[s25]();return self;},"open":function(dte,append,callback){var r8R="hown";var z8R="hildren";var j25=t8R;j25+=f8c;j25+=K8R;j25+=H2c;var T25=C8R;T25+=H8c;T25+=H2c;T25+=R5l.x2c;var O25=v4c;O25+=z8R;var v25=i2R;v25+=Y8c;v25+=H2c;v25+=G2c;var Q25=k9c;Q25+=R5l.x2c;Q25+=I0R;var S25=t8R;S25+=r8R;if(self[S25]){if(callback){callback();}return;}self[U8R]=dte;var content=self[Q25][v25];content[O25]()[d8R]();content[p8R](append)[T25](self[w8R][s8R]);self[j25]=K0R;self[S8R](callback);},"close":function(dte,callback){var P25=k9c;P25+=Q8R;P25+=K8R;P25+=H2c;var I25=k9c;I25+=v8R;I25+=m4c;I25+=H2c;if(!self[I25]){if(callback){callback();}return;}self[U8R]=dte;self[O8R](callback);self[P25]=t0R;},node:function(dte){var q25=T8R;q25+=I0R;return self[q25][f6R][A5c];},"_init":function(){var o8R="_Conten";var n8R="ox";var a8R="div.DTED_Lightb";var P8R="kground";var j8R="opac";var M25=j8R;M25+=l8c;M25+=R5l.e2c;var J25=v4c;J25+=R5l.z2c;J25+=R5l.z2c;var H25=I8R;H25+=P8R;var X25=v4c;X25+=R5l.z2c;X25+=R5l.z2c;var u25=q8R;u25+=R5l.A2c;var G25=T8R;G25+=I0R;var o25=a8R;o25+=n8R;o25+=o8R;o25+=G2c;var n25=k9c;n25+=o6R;var a25=G8R;a25+=I8c;a25+=R5l.x2c;a25+=R5l.e2c;if(self[a25]){return;}var dom=self[n25];dom[u8R]=$(o25,self[G25][u25]);dom[f6R][X25](X8R,A5c);dom[H25][J25](M25,A5c);},"_show":function(callback){var L4R='div.DTED_Lightbox_Shown';var W4R='<div class="DTED_Lightbox_Shown"/>';var k7R="kgro";var J7R="orientation";var H7R="scrollTop";var U7R='height';var z7R="bile";var C7R="ghtbox_Mo";var K7R="DTED_L";var B7R="orie";var A7R="onf";var N7R="tAn";var h7R="fse";var Y7R="kg";var y7R="ightbox";var x7R="_L";var g7R="DTED";var R7R="click.";var b7R="x_Content_Wrapper";var L7R="div.DTED_Lightbo";var k8R="ze.DTED_Lightbox";var M8R="resi";var H8R="_sc";var z95=R5l.p2c;z95+=Z9c;z95+=F8c;var C95=H8R;C95+=t7c;C95+=l9R;C95+=J8R;var t95=M8R;t95+=k8R;var i95=l8R;i95+=m8c;var e95=m4c;e95+=F7R;e95+=W7R;var A95=L7R;A95+=b7R;var h95=R7R;h95+=g7R;h95+=x7R;h95+=y7R;var c95=R5l.p2c;c95+=g0R;c95+=R5l.x2c;var E95=I8R;E95+=Y7R;E95+=m7R;var D95=l8R;D95+=H2c;D95+=R5l.x2c;var Z95=R5l.z2c;Z95+=K7c;Z95+=m9c;var V95=V7R;V95+=f9c;V95+=Z7R;V95+=R5l.Y2c;var m95=D7R;m95+=f7R;m95+=L9c;m95+=v4c;var Y95=k9c;Y95+=R5l.x2c;Y95+=Z9c;Y95+=R5l.g2c;var y95=E7R;y95+=m8c;var x95=c7R;x95+=h7R;x95+=N7R;x95+=f9c;var g95=v4c;g95+=A7R;var R95=v4c;R95+=e7R;var b95=v4c;b95+=R5l.z2c;b95+=R5l.z2c;var L95=i5R;L95+=n9c;var l25=B7R;l25+=i7R;l25+=t7R;l25+=R5l.D2c;var k25=k9c;k25+=R5l.x2c;k25+=I0R;var that=this;var dom=self[k25];if(window[l25]!==undefined){var W95=K7R;W95+=f9c;W95+=C7R;W95+=z7R;var F95=r7R;F95+=F8c;$(F95)[K5R](W95);}dom[L95][b95](U7R,d7R);dom[f6R][R95]({top:-self[g95][x95]});$(p5R)[y95](self[w8R][p7R])[p8R](self[Y95][f6R]);self[m95]();dom[f6R][w7R]()[V95]({opacity:e5c,top:A5c},callback);dom[p7R][Z95]()[s7R]({opacity:e5c});setTimeout(function(){var Q7R='text-indent';$(S7R)[a6R](Q7R,-e5c);},z5c);dom[s8R][D95](v7R,function(e){var f95=v4c;f95+=L9c;f95+=Z9c;f95+=T4c;self[U8R][f95]();});dom[E95][c95](h95,function(e){var N95=O7R;N95+=T7R;N95+=m7R;self[U8R][N95]();});$(A95,dom[e95])[j7R](v7R,function(e){var n7R='DTED_Lightbox_Content_Wrapper';var q7R="as";var P7R="sCl";var B95=I7R;B95+=P7R;B95+=q7R;B95+=R5l.z2c;if($(e[a7R])[B95](n7R)){self[U8R][p7R]();}});$(window)[i95](t95,function(){var X7R="Calc";var K95=o7R;K95+=G7R;K95+=u7R;K95+=X7R;self[K95]();});self[C95]=$(z95)[H7R]();if(window[J7R]!==undefined){var s95=m4c;s95+=M7R;s95+=R5l.A2c;var w95=v9R;w95+=G2c;var p95=I8R;p95+=k7R;p95+=l7R;p95+=R5l.x2c;var d95=H2c;d95+=Z9c;d95+=G2c;var U95=b8c;U95+=k7c;U95+=F4R;var r95=R5l.p2c;r95+=Z9c;r95+=R5l.x2c;r95+=R5l.e2c;var kids=$(r95)[U95]()[d95](dom[p95])[w95](dom[s95]);$(p5R)[p8R](W4R);$(L4R)[p8R](kids);}},"_heightCalc":function(){var f4R="ndowPad";var D4R="wi";var m4R="erHeigh";var g4R="ight";var I95=b4R;I95+=R4R;I95+=R5l.Y2c;I95+=g4R;var j95=x4R;j95+=y4R;var T95=Y4R;T95+=m4R;T95+=G2c;var O95=Y4R;O95+=V4R;var v95=Z4R;v95+=E7R;v95+=D8c;var Q95=D4R;Q95+=f4R;Q95+=u6R;Q95+=c0R;var S95=E4R;S95+=g4R;var dom=self[w8R];var maxHeight=$(window)[S95]()-self[c4R][Q95]*B5c-$(h4R,dom[v95])[O95]()-$(S7R,dom[f6R])[T95]();$(j95,dom[f6R])[a6R](I95,maxHeight);},"_hide":function(callback){var M4R="_scrollTop";var J4R='DTED_Lightbox_Mobile';var X4R="_Lightbox_Shown";var u4R="iv.DTE";var q4R="nta";var P4R="ori";var I4R="roll";var T4R="animat";var v4R="tAni";var S4R="ani";var w4R="ED_Lightbox";var p4R="k.D";var U4R="ED_Lig";var r4R="k.DT";var C4R="Lightbox_Content_Wrapper";var K4R="ED_";var t4R="iv.DT";var A4R="TED_Li";var N4R="resize.D";var V85=N4R;V85+=A4R;V85+=q8c;V85+=a8c;var m85=e4R;m85+=f9c;m85+=H2c;m85+=R5l.x2c;var Y85=E8c;Y85+=B4R;Y85+=H2c;Y85+=R5l.x2c;var y85=Z4R;y85+=i4R;var x85=R5l.x2c;x85+=t4R;x85+=K4R;x85+=C4R;var g85=z4R;g85+=r4R;g85+=U4R;g85+=d4R;var R85=z4R;R85+=p4R;R85+=r9c;R85+=w4R;var b85=l7R;b85+=l8R;b85+=m8c;var L85=v4c;L85+=L9c;L85+=s4R;var F85=S4R;F85+=R5l.g2c;F85+=O4c;var l95=O7R;l95+=T7R;l95+=m7R;var M95=Q4R;M95+=R5l.Y2c;M95+=v4R;var J95=i5R;J95+=O4R;var H95=T4R;H95+=R5l.Y2c;var X95=j4R;X95+=I4R;X95+=J8R;var u95=R5l.p2c;u95+=Z9c;u95+=F8c;var q95=P4R;q95+=R5l.Y2c;q95+=q4R;q95+=a4R;var P95=T8R;P95+=Z9c;P95+=R5l.g2c;var dom=self[P95];if(!callback){callback=function(){};}if(window[q95]!==undefined){var G95=D8c;G95+=n4R;G95+=o4R;var o95=R5l.p2c;o95+=Z9c;o95+=R5l.x2c;o95+=R5l.e2c;var n95=G4R;n95+=R5l.x2c;n95+=r9c;n95+=Z9c;var a95=R5l.x2c;a95+=u4R;a95+=x9c;a95+=X4R;var show=$(a95);show[H4R]()[n95](o95);show[G95]();}$(u95)[M5R](J4R)[X95](self[M4R]);dom[f6R][w7R]()[H95]({opacity:A5c,top:self[J95][M95]},function(){var k4R="detac";var k95=k4R;k95+=f8c;$(this)[k95]();callback();});dom[l95][w7R]()[F85]({opacity:A5c},function(){var W85=l4R;W85+=F1R;$(this)[W85]();});dom[L85][b85](R85);dom[p7R][W1R](g85);$(x85,dom[y85])[Y85](v7R);$(window)[m85](V85);},"_dte":O6R,"_ready":t0R,"_shown":t0R,"_dom":{"wrapper":$(L1R+Z85+b1R+D85+f85+i6R+i6R+i6R),"background":$(E85),"close":$(R1R),"content":O6R}});self=Editor[c85][e8R];self[c4R]={"offsetAni":v5c,"windowPadding":v5c};}(window,document,jQuery,jQuery[h85][o1c]));(function(window,document,$,DataTable){var N3k='<div class="DTED_Envelope_Background"><div/></div>';var h3k='<div class="DTED_Envelope_Container"></div>';var c3k='<div class="DTED_Envelope_Shadow"></div>';var E3k='<div class="DTED DTED_Envelope_Wrapper">';var z0k='div.DTED_Lightbox_Content_Wrapper';var s1R="rou";var i1R="pper";var e1R="appendChild";var h1R="_do";var f1R="envelope";var V1R="xten";var m1R="rolle";var Y1R="displayCont";var y1R="_Envelope_Close\">&times;</div>";var x1R="<div class=\"DTED";var g1R="velo";var k5c=600;var n5c=50;var a45=i5R;a45+=H2c;a45+=R5l.m2c;var q45=R5l.Y2c;q45+=H2c;q45+=g1R;q45+=H8c;var P45=x1R;P45+=y1R;var B85=Y1R;B85+=m1R;B85+=D8c;var e85=R5l.g2c;e85+=Z9c;e85+=R5l.x2c;e85+=W1c;var A85=R5l.Y2c;A85+=V1R;A85+=R5l.x2c;var N85=R5l.x2c;N85+=Z1R;N85+=D1R;var self;Editor[N85][f1R]=$[A85](K0R,{},Editor[e85][B85],{"init":function(dte){var E1R="_init";var i85=k9c;i85+=J0R;self[i85]=dte;self[E1R]();return self;},"open":function(dte,append,callback){var A1R="_dt";var N1R="ildren";var r85=k9c;r85+=R5l.x2c;r85+=Z9c;r85+=R5l.g2c;var z85=i2R;z85+=G2c;z85+=c1R;var C85=h1R;C85+=R5l.g2c;var K85=b8c;K85+=N1R;var t85=A1R;t85+=R5l.Y2c;self[t85]=dte;$(self[w8R][u8R])[K85]()[d8R]();self[C85][z85][e1R](append);self[w8R][u8R][e1R](self[r85][s8R]);self[S8R](callback);},"close":function(dte,callback){self[U8R]=dte;self[O8R](callback);},node:function(dte){var d85=m4c;d85+=B1R;d85+=i1R;var U85=k9c;U85+=R5l.x2c;U85+=I0R;return self[U85][d85][A5c];},"_init":function(){var T1R='visible';var v1R="_ready";var Q1R="Envelope_Container";var S1R="div.DTED_";var w1R="sbilit";var p1R="idden";var d1R="ckgroun";var U1R="spl";var r1R="dOpacity";var z1R="_cssBackgrou";var C1R="ility";var K1R="sb";var t1R="vi";var u85=t1R;u85+=K1R;u85+=C1R;var G85=k9c;G85+=o6R;var o85=z5R;o85+=R5l.Y2c;var n85=e2R;n85+=m9c;n85+=L9c;n85+=D1R;var a85=v4c;a85+=R5l.z2c;a85+=R5l.z2c;var q85=k9c;q85+=R5l.x2c;q85+=Z9c;q85+=R5l.g2c;var P85=z1R;P85+=H2c;P85+=r1R;var I85=R5l.x2c;I85+=f9c;I85+=U1R;I85+=D1R;var j85=O7R;j85+=d1R;j85+=R5l.x2c;var T85=f8c;T85+=p1R;var O85=t1R;O85+=w1R;O85+=R5l.e2c;var v85=T8R;v85+=Z9c;v85+=R5l.g2c;var Q85=Z4R;Q85+=r2R;Q85+=R5l.Y2c;Q85+=D8c;var S85=R5l.p2c;S85+=N4c;S85+=R5l.e2c;var s85=O7R;s85+=T7R;s85+=s1R;s85+=m8c;var w85=r7R;w85+=R5l.x2c;w85+=R5l.e2c;var p85=S1R;p85+=Q1R;if(self[v1R]){return;}self[w8R][u8R]=$(p85,self[w8R][f6R])[A5c];document[w85][e1R](self[w8R][s85]);document[S85][e1R](self[w8R][Q85]);self[v85][p7R][O1R][O85]=T85;self[w8R][j85][O1R][I85]=r9R;self[P85]=$(self[q85][p7R])[a85](X8R);self[w8R][p7R][O1R][n85]=o85;self[G85][p7R][O1R][u85]=T1R;},"_show":function(callback){var t0k='click.DTED_Envelope';var A0k='html,body';var N0k="ffsetHeight";var h0k="windowPaddi";var c0k='normal';var E0k="px";var f0k="marginLeft";var V0k="opacity";var Y0k="Row";var y0k="Att";var x0k="_find";var g0k="lc";var R0k="offsetW";var b0k="wrappe";var L0k="ffs";var W0k="ffsetHei";var F0k="roun";var l1R="backg";var J1R="city";var H1R="ndOpa";var X1R="_cssBackg";var u1R="adeIn";var G1R="windowSc";var o1R="ope";var n1R=".DTED_Envel";var q1R="wra";var P1R="_Envelop";var I1R=".DTED";var j1R="resize";var X75=j1R;X75+=I1R;X75+=P1R;X75+=R5l.Y2c;var u75=R5l.p2c;u75+=g0R;u75+=R5l.x2c;var q75=q1R;q75+=i1R;var T75=v4c;T75+=a1R;T75+=n1R;T75+=o1R;var O75=h1R;O75+=R5l.g2c;var r75=G1R;r75+=j0R;r75+=L9c;var z75=i5R;z75+=H2c;z75+=R5l.m2c;var C75=R5l.m2c;C75+=u1R;var K75=k9c;K75+=v2R;K75+=R5l.g2c;var t75=X1R;t75+=s1R;t75+=H1R;t75+=J1R;var i75=O7R;i75+=Y1c;i75+=I4c;i75+=m8c;var B75=M1R;B75+=t3R;B75+=R5l.e2c;var e75=k1R;e75+=R5l.e2c;e75+=R5l.w2c;var A75=R5l.z2c;A75+=G2c;A75+=R5l.e2c;A75+=R5l.w2c;var N75=l1R;N75+=F0k;N75+=R5l.x2c;var h75=G2c;h75+=Z9c;h75+=m9c;var c75=U5R;c75+=c1R;var E75=m9c;E75+=a8c;var f75=Z9c;f75+=W0k;f75+=u7R;var D75=G2c;D75+=Z9c;D75+=m9c;var Z75=Z9c;Z75+=L0k;Z75+=D4c;var V75=G2c;V75+=Z9c;V75+=m9c;var m75=q8R;m75+=R5l.A2c;var Y75=k9c;Y75+=R5l.x2c;Y75+=Z9c;Y75+=R5l.g2c;var y75=m9c;y75+=a8c;var x75=R5l.z2c;x75+=z4c;x75+=L9c;x75+=R5l.Y2c;var g75=Z4R;g75+=E7R;g75+=D8c;var R75=k9c;R75+=R5l.x2c;R75+=Z9c;R75+=R5l.g2c;var b75=m9c;b75+=a8c;var L75=R5l.z2c;L75+=z4c;L75+=L9c;L75+=R5l.Y2c;var W75=b0k;W75+=D8c;var F75=k9c;F75+=v2R;F75+=R5l.g2c;var l85=R0k;l85+=W6R;l85+=G2c;l85+=f8c;var k85=D7R;k85+=f7R;k85+=g0k;var M85=x0k;M85+=y0k;M85+=F1R;M85+=Y0k;var J85=E4R;J85+=f9c;J85+=u7R;var H85=v4c;H85+=m0k;H85+=G2c;var X85=k9c;X85+=R5l.x2c;X85+=Z9c;X85+=R5l.g2c;var that=this;var formHeight;if(!callback){callback=function(){};}self[X85][H85][O1R][J85]=d7R;var style=self[w8R][f6R][O1R];style[V0k]=A5c;style[y8R]=r9R;var targetRow=self[M85]();var height=self[k85]();var width=targetRow[l85];style[y8R]=Z0k;style[V0k]=e5c;self[F75][W75][L75][D0k]=width+b75;self[R75][g75][x75][f0k]=-(width/B5c)+y75;self[Y75][m75][O1R][V75]=$(targetRow)[Z75]()[D75]+targetRow[f75]+E75;self[w8R][c75][O1R][h75]=-e5c*height-s5c+E0k;self[w8R][N75][A75][V0k]=A5c;self[w8R][p7R][e75][B75]=r9R;$(self[w8R][i75])[s7R]({'opacity':self[t75]},c0k);$(self[K75][f6R])[C75]();if(self[z75][r75]){var w75=h0k;w75+=c0R;var p75=v4c;p75+=Z9c;p75+=H2c;p75+=R5l.m2c;var d75=Z9c;d75+=N0k;var U75=c7R;U75+=R5l.m2c;U75+=G4c;$(A0k)[s7R]({"scrollTop":$(targetRow)[U75]()[e0k]+targetRow[d75]-self[p75][w75]},function(){var s75=k9c;s75+=o6R;$(self[s75][u8R])[s7R]({"top":A5c},k5c,callback);});}else{var v75=V7R;v75+=f9c;v75+=B0k;v75+=Y8c;var Q75=i5R;Q75+=n9c;var S75=k9c;S75+=R5l.x2c;S75+=Z9c;S75+=R5l.g2c;$(self[S75][Q75])[v75]({"top":A5c},k5c,callback);}$(self[O75][s8R])[j7R](T75,function(e){var j75=k9c;j75+=i0k;j75+=R5l.Y2c;self[j75][s8R]();});$(self[w8R][p7R])[j7R](t0k,function(e){var K0k="kgr";var P75=I8R;P75+=K0k;P75+=Z9c;P75+=C0k;var I75=k9c;I75+=i0k;I75+=R5l.Y2c;self[I75][P75]();});$(z0k,self[w8R][q75])[j7R](t0k,function(e){var p0k="ackgroun";var d0k="rge";var U0k="elope_Content_Wr";var r0k="DTED_Env";var n75=r0k;n75+=U0k;n75+=C8R;n75+=W7R;var a75=j3R;a75+=d0k;a75+=G2c;if($(e[a75])[M6R](n75)){var G75=R5l.p2c;G75+=p0k;G75+=R5l.x2c;var o75=k9c;o75+=R5l.x2c;o75+=G2c;o75+=R5l.Y2c;self[o75][G75]();}});$(window)[u75](X75,function(){var w0k="_heightCalc";self[w0k]();});},"_heightCalc":function(){var H0k='maxHeight';var X0k="height";var u0k="heightCalc";var G0k="ightCal";var n0k="chil";var a0k="addin";var q0k="wP";var P0k="windo";var I0k="Heig";var T0k="div.DTE_Fo";var O0k="outer";var v0k="_Conte";var Q0k="div.DTE_Body";var S0k="rappe";var Z45=Y4R;Z45+=V4R;var V45=s0k;V45+=m9c;V45+=R5l.Y2c;V45+=D8c;var m45=R5l.x2c;m45+=Z9c;m45+=R5l.g2c;var Y45=k9c;Y45+=R5l.x2c;Y45+=G2c;Y45+=R5l.Y2c;var y45=m4c;y45+=S0k;y45+=D8c;var x45=Q0k;x45+=v0k;x45+=i7R;var g45=O0k;g45+=R4R;g45+=G7R;g45+=u7R;var R45=m4c;R45+=F7R;R45+=H8c;R45+=D8c;var b45=T0k;b45+=j0k;var L45=O0k;L45+=I0k;L45+=d2R;var W45=k9c;W45+=v2R;W45+=R5l.g2c;var F45=P0k;F45+=q0k;F45+=a0k;F45+=o5R;var l75=f8c;l75+=G7R;l75+=u7R;var k75=n0k;k75+=F4R;var M75=v4c;M75+=o0k;var J75=E4R;J75+=G0k;J75+=v4c;var H75=i2R;H75+=R5l.m2c;var formHeight;formHeight=self[H75][u0k]?self[c4R][J75](self[w8R][f6R]):$(self[w8R][M75])[k75]()[l75]();var maxHeight=$(window)[X0k]()-self[c4R][F45]*B5c-$(h4R,self[W45][f6R])[L45]()-$(b45,self[w8R][R45])[g45]();$(x45,self[w8R][y45])[a6R](H0k,maxHeight);return $(self[Y45][m45][V45])[Z45]();},"_hide":function(callback){var y3k='resize.DTED_Lightbox';var F3k="offsetHeight";var l0k="ound";var k0k="backgr";var M0k="D_Lig";var J0k="lick.DTE";var r45=v4c;r45+=J0k;r45+=M0k;r45+=d4R;var z45=E8c;z45+=B4R;z45+=H2c;z45+=R5l.x2c;var C45=k9c;C45+=o6R;var K45=E8c;K45+=B4R;K45+=H2c;K45+=R5l.x2c;var t45=k0k;t45+=l0k;var i45=k9c;i45+=o6R;var B45=e4R;B45+=f9c;B45+=H2c;B45+=R5l.x2c;var e45=q4c;e45+=s4R;var A45=k9c;A45+=o6R;var f45=i5R;f45+=n9c;var D45=h1R;D45+=R5l.g2c;if(!callback){callback=function(){};}$(self[D45][u8R])[s7R]({"top":-(self[w8R][f45][F3k]+n5c)},k5c,function(){var x3k="rapper";var g3k="backgro";var b3k="fad";var W3k="norm";var N45=W3k;N45+=L3k;var h45=b3k;h45+=R3k;var c45=g3k;c45+=C0k;var E45=m4c;E45+=x3k;$([self[w8R][E45],self[w8R][c45]])[h45](N45,callback);});$(self[A45][e45])[B45](v7R);$(self[i45][t45])[K45](v7R);$(z0k,self[C45][f6R])[z45](r45);$(window)[W1R](y3k);},"_findAttachRow":function(){var m3k="ctio";var Y3k="reate";var Q45=v4c;Q45+=Y3k;var S45=R5l.R2c;S45+=m3k;S45+=H2c;var s45=k9c;s45+=R5l.x2c;s45+=G2c;s45+=R5l.Y2c;var d45=E4R;d45+=R5l.R2c;d45+=R5l.x2c;var U45=x9c;U45+=t7R;U45+=R5l.R2c;U45+=F7c;var dt=$(self[U8R][R5l.z2c][s9R])[U45]();if(self[c4R][V3k]===d45){var w45=Z3k;w45+=R5l.x2c;w45+=R5l.A2c;var p45=G2c;p45+=R5l.R2c;p45+=o9R;p45+=R5l.Y2c;return dt[p45]()[w45]();}else if(self[s45][R5l.z2c][S45]===Q45){var O45=E4R;O45+=L8c;var v45=G2c;v45+=D3k;v45+=R5l.Y2c;return dt[v45]()[O45]();}else{var I45=M4c;I45+=f9c;I45+=r4c;I45+=R5l.A2c;var j45=k9c;j45+=R5l.x2c;j45+=G2c;j45+=R5l.Y2c;var T45=t7c;T45+=m4c;return dt[T45](self[j45][R5l.z2c][I45])[f3k]();}},"_dte":O6R,"_ready":t0R,"_cssBackgroundOpacity":e5c,"_dom":{"wrapper":$(E3k+c3k+h3k+i6R)[A5c],"background":$(N3k)[A5c],"close":$(P45)[A5c],"content":O6R}});self=Editor[y8R][q45];self[a45]={"windowPadding":n5c,"heightCalc":O6R,"attach":A3k,"windowScroll":K0R};}(window,document,jQuery,jQuery[R5l.S2c][o1c]));Editor[x5R][n45]=function(cfg,after){var P3k="nshift";var Q3k="editFie";var S3k="iRe";var w3k='initField';var p3k="'. A field already exists with this name";var d3k="Error adding field '";var r3k=" `name` option";var z3k="equires a";var C3k="Error adding field. The field r";var i3k="asses";var e3k="Array";var o45=f9c;o45+=R5l.z2c;o45+=e3k;if($[o45](cfg)){for(var i=A5c,iLen=cfg[i0R];i<iLen;i++){var G45=R5l.R2c;G45+=B3k;this[G45](cfg[i]);}}else{var k45=R5l.g2c;k45+=Z9c;k45+=R5l.x2c;k45+=R5l.Y2c;var M45=R5l.m2c;M45+=f9c;M45+=R5l.Y2c;M45+=W2R;var J45=q4c;J45+=i3k;var H45=Z8c;H45+=f9c;H45+=t3k;var X45=w7c;X45+=K3k;var name=cfg[R6R];if(name===undefined){var u45=C3k;u45+=z3k;u45+=r3k;throw u45;}if(this[R5l.z2c][U3k][name]){throw d3k+name+p3k;}this[X45](w3k,cfg);var field=new Editor[H45](cfg,this[J45][M45],this);if(this[R5l.z2c][k45]){var F15=R5l.g2c;F15+=s3k;F15+=S3k;F15+=G4c;var l45=Q3k;l45+=v3k;var editFields=this[R5l.z2c][l45];field[F15]();$[u2R](editFields,function(idSrc,edit){var j3k="mData";var O3k="tiSet";var g15=R5l.x2c;g15+=R5l.Y2c;g15+=R5l.m2c;var R15=R5l.g2c;R15+=E8c;R15+=L9c;R15+=O3k;var W15=R5l.x2c;W15+=R5l.R2c;W15+=G2c;W15+=R5l.R2c;var val;if(edit[W15]){var b15=R5l.x2c;b15+=R5l.R2c;b15+=j3R;var L15=T3k;L15+=j3k;val=field[L15](edit[b15]);}field[R15](idSrc,val!==undefined?val:field[g15]());});}this[R5l.z2c][U3k][name]=field;if(after===undefined){var x15=b0R;x15+=R5l.z2c;x15+=f8c;this[R5l.z2c][I3k][x15](name);}else if(after===O6R){var Y15=E8c;Y15+=P3k;var y15=P9c;y15+=R5l.x2c;y15+=R5l.Y2c;y15+=D8c;this[R5l.z2c][y15][Y15](name);}else{var m15=g0R;m15+=q3k;m15+=D1R;var idx=$[m15](after,this[R5l.z2c][I3k]);this[R5l.z2c][I3k][a3k](idx+e5c,A5c,name);}}this[n3k](this[I3k]());return this;};Editor[V15][Z15]=function(){var u3k="editOpt";var G3k="bmi";var E15=o3k;E15+=G3k;E15+=G2c;var D15=u3k;D15+=R5l.z2c;var onBackground=this[R5l.z2c][D15][X3k];if(typeof onBackground===R5R){onBackground(this);}else if(onBackground===x8R){this[H3k]();}else if(onBackground===J3k){var f15=v4c;f15+=M3k;f15+=R5l.Y2c;this[f15]();}else if(onBackground===E15){this[k3k]();}return this;};Editor[x5R][H3k]=function(){this[l3k]();return this;};Editor[x5R][F6k]=function(cells,fieldNames,show,opts){var V5k="_focus";var Y5k="click";var k6k="mI";var J6k="prepend";var u6k="pendTo";var G6k="pointer";var n6k="liner";var q6k="bg";var p6k="isPlainObj";var r6k="vidual";var z6k="ions";var C6k="_formOp";var K6k="ize.";var i6k="bub";var e6k=" cl";var c6k="\"><div";var f6k="<div class";var D6k="r\"><span></div>";var Z6k="<div class=\"DTE_Processing_Indicato";var m6k="hildr";var Y6k="childr";var y6k="child";var x6k="formErr";var b6k="seReg";var L6k="bubblePositio";var W6k="ubb";var W0U=R5l.p2c;W0U+=W6k;W0U+=R5l.w2c;var F0U=L6k;F0U+=H2c;var H15=o7c;H15+=A9R;H15+=b6k;var X15=R5l.R2c;X15+=R5l.x2c;X15+=R5l.x2c;var q15=R6k;q15+=g6k;var P15=R5l.m2c;P15+=Z9c;P15+=D8c;P15+=R5l.g2c;var I15=R5l.x2c;I15+=Z9c;I15+=R5l.g2c;var j15=x6k;j15+=Z9c;j15+=D8c;var T15=y6k;T15+=D8c;T15+=j6R;var O15=Y6k;O15+=R5l.Y2c;O15+=H2c;var v15=v4c;v15+=m6k;v15+=j6R;var S15=V6k;S15+=G0R;var s15=k0R;s15+=l0R;s15+=R5l.x2c;s15+=o0R;var w15=Z6k;w15+=D6k;var p15=j3R;p15+=o9R;p15+=R5l.Y2c;var d15=f6k;d15+=E6k;var U15=c6k;U15+=h6k;U15+=N6k;U15+=u0R;var r15=A6k;r15+=e6k;r15+=B6k;r15+=E6k;var z15=i6k;z15+=R5l.p2c;z15+=L9c;z15+=R5l.Y2c;var C15=t6k;C15+=l2R;C15+=f8c;var K15=D8c;K15+=H7c;K15+=K6k;var t15=Z9c;t15+=H2c;var i15=C6k;i15+=G2c;i15+=z6k;var B15=g0R;B15+=u6R;B15+=r6k;var e15=k9c;e15+=R5l.x2c;e15+=U6k;var A15=i6k;A15+=d6k;var N15=R5l.Y2c;N15+=a8c;N15+=Y8c;N15+=m8c;var h15=p6k;h15+=w6k;h15+=G2c;var that=this;if(this[s6k](function(){var S6k="bubbl";var c15=S6k;c15+=R5l.Y2c;that[c15](cells,fieldNames,opts);})){return this;}if($[h15](fieldNames)){opts=fieldNames;fieldNames=undefined;show=K0R;}else if(typeof fieldNames===Q6k){show=fieldNames;fieldNames=undefined;opts=undefined;}if($[G2R](show)){opts=show;show=K0R;}if(show===undefined){show=K0R;}opts=$[N15]({},this[R5l.z2c][g8R][A15],opts);var editFields=this[e15](B15,cells,fieldNames);this[v6k](cells,editFields,O6k,opts);var namespace=this[i15](opts);var ret=this[T6k](O6k);if(!ret){return this;}$(window)[t15](K15+namespace,function(){that[j6k]();});var nodes=[];this[R5l.z2c][I6k]=nodes[P6k][V5R](nodes,_pluck(editFields,C15));var classes=this[G5R][z15];var background=$(r15+classes[q6k]+U15);var container=$(d15+classes[f6R]+U6R+a6k+classes[n6k]+U6R+a6k+classes[p15]+U6R+a6k+classes[s8R]+o6k+w15+s15+i6R+S15+classes[G6k]+o6k+i6R);if(show){var Q15=R5l.R2c;Q15+=m9c;Q15+=u6k;container[Q15](p5R);background[X6k](p5R);}var liner=container[v15]()[H6k](A5c);var table=liner[O15]();var close=table[T15]();liner[p8R](this[o6R][j15]);table[J6k](this[I15][P15]);if(opts[q15]){var n15=M6k;n15+=k6k;n15+=O4R;n15+=Z9c;var a15=m9c;a15+=k2R;a15+=R5l.Y2c;a15+=m8c;liner[a15](this[o6R][n15]);}if(opts[l6k]){var o15=R5l.x2c;o15+=I0R;liner[J6k](this[o15][F5k]);}if(opts[W5k]){var u15=R5l.p2c;u15+=L5k;u15+=b5k;var G15=R5l.x2c;G15+=Z9c;G15+=R5l.g2c;table[p8R](this[G15][u15]);}var pair=$()[u5R](container)[X15](background);this[H15](function(submitComplete){pair[s7R]({opacity:A5c},function(){var g5k="size.";var k15=R5k;k15+=g5k;var M15=Z9c;M15+=x5k;var J15=R5l.x2c;J15+=D4c;J15+=l2R;J15+=f8c;pair[J15]();$(window)[M15](k15+namespace);that[y5k]();});});background[Y5k](function(){var l15=R5l.p2c;l15+=L9c;l15+=E8c;l15+=D8c;that[l15]();});close[Y5k](function(){that[m5k]();});this[F0U]();pair[s7R]({opacity:e5c});this[V5k](this[R5l.z2c][Z5k],opts[h2R]);this[D5k](W0U);return this;};Editor[L0U][j6k]=function(){var s5k='left';var w5k="elow";var p5k="bottom";var d5k="outerWidth";var U5k="right";var e5k='div.DTE_Bubble_Liner';var A5k="ubble";var N5k="B";var h5k="div.DTE_";var c5k="ott";var E5k="igh";var w5c=15;var e0U=G2c;e0U+=Z9c;e0U+=m9c;var A0U=f5k;A0U+=R5l.z2c;var N0U=j5R;N0U+=e7R;N0U+=R5l.Y2c;N0U+=R5l.z2c;var h0U=m4c;h0U+=f9c;h0U+=i0k;h0U+=f8c;var c0U=D8c;c0U+=E5k;c0U+=G2c;var E0U=K7c;E0U+=m9c;var f0U=R5l.p2c;f0U+=c5k;f0U+=Z9c;f0U+=R5l.g2c;var D0U=L9c;D0U+=R5l.Y2c;D0U+=R5l.m2c;D0U+=G2c;var b0U=h5k;b0U+=N5k;b0U+=A5k;var wrapper=$(b0U),liner=$(e5k),nodes=this[R5l.z2c][I6k];var position={top:A5c,left:A5c,right:A5c,bottom:A5c};$[u2R](nodes,function(i,node){var K5k="ig";var t5k="fsetWidth";var i5k="bot";var B5k="etHei";var Z0U=Q4R;Z0U+=B5k;Z0U+=o5R;Z0U+=d2R;var V0U=i5k;V0U+=K7c;V0U+=R5l.g2c;var m0U=c7R;m0U+=t5k;var Y0U=D8c;Y0U+=K5k;Y0U+=f8c;Y0U+=G2c;var y0U=L9c;y0U+=R5l.Y2c;y0U+=R5l.m2c;y0U+=G2c;var x0U=C5k;x0U+=G2c;var g0U=G2c;g0U+=Z9c;g0U+=m9c;var R0U=o5R;R0U+=R5l.Y2c;R0U+=G2c;var pos=$(node)[z5k]();node=$(node)[R0U](A5c);position[e0k]+=pos[g0U];position[x0U]+=pos[y0U];position[Y0U]+=pos[r5k]+node[m0U];position[V0U]+=pos[e0k]+node[Z0U];});position[e0k]/=nodes[i0R];position[D0U]/=nodes[i0R];position[U5k]/=nodes[i0R];position[f0U]/=nodes[i0R];var top=position[E0U],left=(position[r5k]+position[c0U])/B5c,width=liner[d5k](),visLeft=left-width/B5c,visRight=visLeft+width,docWidth=$(window)[h0U](),padding=w5c,classes=this[N0U][F6k];wrapper[A0U]({top:top,left:left});if(liner[i0R]&&liner[z5k]()[e0U]<A5c){var t0U=r3R;t0U+=K8R;var i0U=K7c;i0U+=m9c;var B0U=v4c;B0U+=R5l.z2c;B0U+=R5l.z2c;wrapper[B0U](i0U,position[p5k])[K5R](t0U);}else{var K0U=R5l.p2c;K0U+=w5k;wrapper[M5R](K0U);}if(visRight+padding>docWidth){var diff=visRight-docWidth;liner[a6R](s5k,visLeft<padding?-(visLeft-padding):-(diff+padding));}else{var C0U=f5k;C0U+=R5l.z2c;liner[C0U](s5k,visLeft<padding?-(visLeft-padding):A5c);}return this;};Editor[z0U][W5k]=function(buttons){var d0U=R5l.Y2c;d0U+=R5l.R2c;d0U+=v4c;d0U+=f8c;var U0U=R5l.x2c;U0U+=Z9c;U0U+=R5l.g2c;var that=this;if(buttons===S5k){buttons=[{text:this[u3R][this[R5l.z2c][Q5k]][k3k],action:function(){var r0U=o3k;r0U+=R5l.p2c;r0U+=v5k;this[r0U]();}}];}else if(!$[V9R](buttons)){buttons=[buttons];}$(this[U0U][W5k])[O5k]();$[d0U](buttons,function(i,btn){var M5k="preventDefault";var X5k='keypress';var G5k="tabIndex";var o5k='tabindex';var a5k='<button/>';var q5k="trin";var P5k="functio";var j5k="yup";var q0U=R5l.p2c;q0U+=T5k;q0U+=W5R;q0U+=R5l.z2c;var P0U=R5l.x2c;P0U+=Z9c;P0U+=R5l.g2c;var I0U=q4c;I0U+=y8c;I0U+=e9R;var T0U=Z9c;T0U+=H2c;var v0U=e9R;v0U+=R5l.Y2c;v0U+=j5k;var Q0U=t7R;Q0U+=I5k;var S0U=P5k;S0U+=H2c;var s0U=R5l.m2c;s0U+=H2c;var w0U=L9c;w0U+=R5l.R2c;w0U+=p3R;w0U+=L9c;var p0U=R5l.z2c;p0U+=q5k;p0U+=o5R;if(typeof btn===p0U){btn={text:btn,action:function(){this[k3k]();}};}var text=btn[W8R]||btn[w0U];var action=btn[Q5k]||btn[s0U];$(a5k,{'class':that[G5R][n5k][R8R]+(btn[N6R]?E6R+btn[N6R]:Q1c)})[s2R](typeof text===S0U?text(that):text||Q1c)[Q0U](o5k,btn[G5k]!==undefined?btn[G5k]:A5c)[W5R](v0U,function(e){if(e[u5k]===d5c&&action){var O0U=v4c;O0U+=L3k;O0U+=L9c;action[O0U](that);}})[T0U](X5k,function(e){var J5k="Code";var j0U=H5k;j0U+=J5k;if(e[j0U]===d5c){e[M5k]();}})[W5R](I0U,function(e){e[M5k]();if(action){action[Y5R](that);}})[X6k](that[P0U][q0U]);});return this;};Editor[a0U][k5k]=function(fieldName){var g2k="dNam";var L2k="stro";var W2k="ord";var n0U=R5l.z2c;n0U+=l5k;n0U+=c0R;var that=this;var fields=this[R5l.z2c][U3k];if(typeof fieldName===n0U){var u0U=F2k;u0U+=L9c;u0U+=y8c;u0U+=R5l.Y2c;var G0U=W2k;G0U+=R5l.Y2c;G0U+=D8c;var o0U=R5l.x2c;o0U+=R5l.Y2c;o0U+=L2k;o0U+=R5l.e2c;that[b2k](fieldName)[o0U]();delete fields[fieldName];var orderIdx=$[o2R](fieldName,this[R5l.z2c][I3k]);this[R5l.z2c][G0U][u0U](orderIdx,e5c);var includeIdx=$[o2R](fieldName,this[R5l.z2c][Z5k]);if(includeIdx!==-e5c){this[R5l.z2c][Z5k][a3k](includeIdx,e5c);}}else{var X0U=k9c;X0U+=R2k;X0U+=g2k;X0U+=H7c;$[u2R](this[X0U](fieldName),function(i,name){var H0U=q4c;H0U+=R5l.Y2c;H0U+=z8c;that[H0U](name);});}return this;};Editor[J0U][M0U]=function(){this[m5k](t0R);return this;};Editor[k0U][l0U]=function(arg1,arg2,arg3,arg4){var i2k="tField";var e2k="_ti";var A2k="ber";var N2k="um";var Z2k="styl";var m2k="playReo";var Y2k="_dis";var x2k="initCre";var c3U=Z5R;c3U+=b9c;var E3U=x2k;E3U+=O4c;var f3U=C7c;f3U+=y2k;f3U+=G2c;var V3U=Y2k;V3U+=m2k;V3U+=V2k;V3U+=R5l.A2c;var m3U=Z2k;m3U+=R5l.Y2c;var Y3U=V2R;Y3U+=D2k;var y3U=f2k;y3U+=E2k;var x3U=B0k;x3U+=g0R;var g3U=H4c;g3U+=R5l.x2c;g3U+=R5l.Y2c;var R3U=c2k;R3U+=h2k;R3U+=O7c;var L3U=H2c;L3U+=N2k;L3U+=A2k;var F3U=e2k;F3U+=R5l.x2c;F3U+=R5l.e2c;var that=this;var fields=this[R5l.z2c][U3k];var count=e5c;if(this[F3U](function(){var W3U=v4c;W3U+=R5k;W3U+=R5l.R2c;W3U+=Y8c;that[W3U](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1===L3U){count=arg1;arg1=arg2;arg2=arg3;}this[R5l.z2c][B2k]={};for(var i=A5c;i<count;i++){var b3U=R5l.Y2c;b3U+=u6R;b3U+=i2k;b3U+=R5l.z2c;this[R5l.z2c][b3U][i]={fields:this[R5l.z2c][U3k]};}var argOpts=this[R3U](arg1,arg2,arg3,arg4);this[R5l.z2c][g3U]=x3U;this[R5l.z2c][Q5k]=y3U;this[R5l.z2c][t2k]=O6R;this[o6R][Y3U][m3U][y8R]=r9R;this[K2k]();this[V3U](this[U3k]());$[u2R](fields,function(name,field){var C2k="ltiReset";var Z3U=E4c;Z3U+=C2k;field[Z3U]();for(var i=A5c;i<count;i++){var D3U=R5l.g2c;D3U+=s3k;D3U+=Z4c;D3U+=D4c;field[D3U](i,field[F9c]());}field[G4c](field[F9c]());});this[f3U](E3U);this[z2k]();this[r2k](argOpts[c3U]);argOpts[U2k]();return this;};Editor[x5R][h3U]=function(parent,url,opts){var Q2k="dent";var S2k="dep";var d2k="hange";var B3U=v4c;B3U+=d2k;var e3U=R5l.Y2c;e3U+=p2k;e3U+=j6R;e3U+=R5l.x2c;if($[V9R](parent)){var N3U=w2k;N3U+=s2k;for(var i=A5c,ien=parent[N3U];i<ien;i++){var A3U=S2k;A3U+=j6R;A3U+=Q2k;this[A3U](parent[i],url,opts);}return this;}var that=this;var field=this[b2k](parent);var ajaxOpts={type:v2k,dataType:O2k};opts=$[e3U]({event:B3U,data:O6R,preUpdate:O6R,postUpdate:O6R},opts);var update=function(json){var n2k="postUp";var a2k="postUpdate";var q2k='error';var P2k='val';var j2k="preUpdate";var d3U=e2R;d3U+=D3k;d3U+=R5l.Y2c;var U3U=j6R;U3U+=v0R;U3U+=R5l.w2c;var r3U=Q8R;r3U+=Z9c;r3U+=m4c;var z3U=f8c;z3U+=f9c;z3U+=R5l.x2c;z3U+=R5l.Y2c;var K3U=R6k;K3U+=R5l.z2c;K3U+=R5l.R2c;K3U+=D1c;var t3U=T2k;t3U+=R5l.x2c;t3U+=t7R;t3U+=R5l.Y2c;var i3U=I8c;i3U+=v4c;i3U+=f8c;if(opts[j2k]){opts[j2k](json);}$[i3U]({labels:I2k,options:t3U,values:P2k,messages:K3U,errors:q2k},function(jsonProp,fieldFn){if(json[jsonProp]){var C3U=C0R;C3U+=f8c;$[C3U](json[jsonProp],function(field,val){that[b2k](field)[fieldFn](val);});}});$[u2R]([z3U,r3U,U3U,d3U],function(i,key){if(json[key]){that[key](json[key]);}});if(opts[a2k]){var p3U=n2k;p3U+=o2k;opts[p3U](json);}};$(field[f3k]())[W5R](opts[G2k],function(e){var F9k="nObject";var l2k="isPlai";var k2k="values";var I3U=u2k;I3U+=v4c;I3U+=G2c;I3U+=R5l.D2c;var O3U=Q3R;O3U+=R5l.R2c;O3U+=L9c;var v3U=D8c;v3U+=Z9c;v3U+=m4c;var Q3U=u2c;Q3U+=L6R;Q3U+=t3k;Q3U+=R5l.z2c;var S3U=t7c;S3U+=X2k;var s3U=j3R;s3U+=D8c;s3U+=D1c;s3U+=G2c;var w3U=H2k;w3U+=R5l.x2c;if($(field[f3k]())[w3U](e[s3U])[i0R]===A5c){return;}var data={};data[S3U]=that[R5l.z2c][B2k]?_pluck(that[R5l.z2c][Q3U],J2k):O6R;data[v3U]=data[M2k]?data[M2k][A5c]:O6R;data[k2k]=that[O3U]();if(opts[g6R]){var T3U=R5l.x2c;T3U+=R5l.R2c;T3U+=j3R;var ret=opts[T3U](data);if(ret){var j3U=I3R;j3U+=G2c;j3U+=R5l.R2c;opts[j3U]=ret;}}if(typeof url===I3U){var P3U=l6R;P3U+=L9c;var o=url(field[P3U](),data,update);if(o){update(o);}}else{var q3U=l2k;q3U+=F9k;if($[q3U](url)){$[H3R](ajaxOpts,url);}else{var a3U=E8c;a3U+=D8c;a3U+=L9c;ajaxOpts[a3U]=url;}$[W9k]($[H3R](ajaxOpts,{url:url,data:data,success:update}));}});return this;};Editor[x5R][L9k]=function(){var y9k='.dte';var x9k="troller";var g9k="splayCon";var R9k="roy";var b9k="nique";var H3U=E8c;H3U+=b9k;var X3U=Z9c;X3U+=R5l.m2c;X3U+=R5l.m2c;var u3U=S4c;u3U+=R5l.z2c;u3U+=G2c;u3U+=R9k;var G3U=u6R;G3U+=g9k;G3U+=x9k;var n3U=e2R;n3U+=B2R;n3U+=R5l.e2c;n3U+=g8c;if(this[R5l.z2c][n3U]){var o3U=q4c;o3U+=Z9c;o3U+=R5l.z2c;o3U+=R5l.Y2c;this[o3U]();}this[k5k]();var controller=this[R5l.z2c][G3U];if(controller[u3U]){controller[L9k](this);}$(document)[X3U](y9k+this[R5l.z2c][H3U]);this[o6R]=O6R;this[R5l.z2c]=O6R;};Editor[x5R][Y9k]=function(name){var that=this;$[u2R](this[m9k](name),function(i,n){that[b2k](n)[Y9k]();});return this;};Editor[J3U][y8R]=function(show){var k3U=a4c;k3U+=T4c;var M3U=Z9c;M3U+=V9k;if(show===undefined){return this[R5l.z2c][Z9k];}return this[show?M3U:k3U]();};Editor[l3U][Z9k]=function(){return $[D9k](this[R5l.z2c][U3k],function(field,name){var f9k="yed";var F6U=M1R;F6U+=t3R;F6U+=f9k;return field[F6U]()?name:O6R;});};Editor[x5R][W6U]=function(){var L6U=H2c;L6U+=N4c;L6U+=R5l.Y2c;return this[R5l.z2c][L8R][L6U](this);};Editor[b6U][u2c]=function(items,arg1,arg2,arg3,arg4){var B9k="_crudArgs";var E9k="formOp";var m6U=k9c;m6U+=E9k;m6U+=f5R;m6U+=c9k;var Y6U=Z9c;Y6U+=h9k;var y6U=B0k;y6U+=f9c;y6U+=H2c;var x6U=R5l.m2c;x6U+=f9c;x6U+=t3k;x6U+=R5l.z2c;var g6U=N9k;g6U+=A9k;g6U+=e9k;var that=this;if(this[s6k](function(){var R6U=R5l.Y2c;R6U+=R5l.x2c;R6U+=f9c;R6U+=G2c;that[R6U](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[B9k](arg1,arg2,arg3,arg4);this[v6k](items,this[g6U](x6U,items),y6U,argOpts[Y6U]);this[z2k]();this[m6U](argOpts[H6R]);argOpts[U2k]();return this;};Editor[x5R][V6U]=function(name){var Z6U=R5l.Y2c;Z6U+=F1R;var that=this;$[Z6U](this[m9k](name),function(i,n){var i9k="nabl";var D6U=R5l.Y2c;D6U+=i9k;D6U+=R5l.Y2c;that[b2k](n)[D6U]();});return this;};Editor[x5R][H5R]=function(name,msg){var K9k="_m";var t9k="mError";if(msg===undefined){var c6U=M6k;c6U+=t9k;var E6U=R5l.x2c;E6U+=Z9c;E6U+=R5l.g2c;var f6U=K9k;f6U+=H7c;f6U+=C9k;f6U+=D1c;this[f6U](this[E6U][c6U],name);}else{var h6U=r4c;h6U+=t3k;this[h6U](name)[H5R](msg);}return this;};Editor[N6U][b2k]=function(name){var p9k="e - ";var d9k="eld nam";var U9k="known fi";var r9k="Un";var A6U=r4c;A6U+=z9k;var fields=this[R5l.z2c][A6U];if(!fields[name]){var e6U=r9k;e6U+=U9k;e6U+=d9k;e6U+=p9k;throw e6U+name;}return fields[name];};Editor[B6U][i6U]=function(){return $[D9k](this[R5l.z2c][U3k],function(field,name){return name;});};Editor[t6U][w9k]=_api_file;Editor[K6U][C6U]=_api_files;Editor[z6U][s9k]=function(name){var p6U=o5R;p6U+=D4c;var d6U=R5l.m2c;d6U+=a3R;d6U+=R5l.x2c;var that=this;if(!name){name=this[U3k]();}if($[V9R](name)){var out={};$[u2R](name,function(i,n){var U6U=o5R;U6U+=R5l.Y2c;U6U+=G2c;var r6U=n3R;r6U+=L9c;r6U+=R5l.x2c;out[n]=that[r6U](n)[U6U]();});return out;}return this[d6U](name)[p6U]();};Editor[x5R][w6U]=function(names,animate){var S9k="_fie";var s6U=S9k;s6U+=L9c;s6U+=i7c;var that=this;$[u2R](this[s6U](names),function(i,n){var Q6U=Q9k;Q6U+=S4c;var S6U=r4c;S6U+=t3k;that[S6U](n)[Q6U](animate);});return this;};Editor[v6U][O6U]=function(inNames){var q9k="inError";var I9k="sible";var j9k=":vi";var T9k=":empty)";var O9k="not(";var P6U=v9k;P6U+=O9k;P6U+=T9k;var I6U=f9c;I6U+=R5l.z2c;var j6U=j9k;j6U+=I9k;var T6U=n5k;T6U+=P9k;T6U+=J5R;var formError=$(this[o6R][T6U]);if(formError[d9R](j6U)&&formError[I6U](P6U)){return K0R;}var names=this[m9k](inNames);for(var i=A5c,ien=names[i0R];i<ien;i++){var q6U=r4c;q6U+=R5l.Y2c;q6U+=W2R;if(this[q6U](names[i])[q9k]()){return K0R;}}return t0R;};Editor[a6U][n6U]=function(cell,fieldName,opts){var E8k='<div class="DTE_Processing_Indicator"><span/></div>';var y8k="inline";var x8k='individual';var g8k="nli";var R8k="taSource";var L8k="ses";var W8k="div.DTE_F";var F8k="ption";var l9k="ormO";var k9k="nts";var M9k="iv";var J9k="/d";var X9k="v ";var u9k="uttons";var G9k="lin";var w5U=g0R;w5U+=P8c;w5U+=H2c;w5U+=R5l.Y2c;var p5U=y6R;p5U+=a9k;var c5U=n9k;c5U+=o9k;var E5U=R5l.x2c;E5U+=Z9c;E5U+=R5l.g2c;var f5U=C8R;f5U+=V9k;f5U+=R5l.x2c;var D5U=C8R;D5U+=H8c;D5U+=m8c;var Z5U=R5k;Z5U+=B9R;Z5U+=F9R;var V5U=G9k;V5U+=R5l.A2c;var m5U=G0R;m5U+=l0R;m5U+=u0R;var Y5U=R5l.p2c;Y5U+=u9k;var y5U=s3R;y5U+=X9k;y5U+=j5R;y5U+=H9k;var x5U=k0R;x5U+=J9k;x5U+=M9k;x5U+=u0R;var g5U=P8c;g5U+=h9R;var R5U=G0R;R5U+=u0R;var b5U=U5R;b5U+=R5l.Y2c;b5U+=k9k;var L5U=y6R;L5U+=l9k;L5U+=F8k;L5U+=R5l.z2c;var W5U=C7c;W5U+=R5l.x2c;W5U+=l8c;var l6U=k9c;l6U+=u4c;l6U+=F8c;var k6U=W8k;k6U+=R1c;var X6U=R5l.Y2c;X6U+=R5l.R2c;X6U+=v4c;X6U+=f8c;var u6U=q4c;u6U+=R5l.R2c;u6U+=R5l.z2c;u6U+=L8k;var G6U=b8k;G6U+=R8k;var o6U=f9c;o6U+=g8k;o6U+=e4c;var that=this;if($[G2R](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[H3R]({},this[R5l.z2c][g8R][o6U],opts);var editFields=this[G6U](x8k,cell,fieldName);var node,field;var countOuter=A5c,countInner;var closed=t0R;var classes=this[u6U][y8k];$[X6U](editFields,function(i,editField){var V8k='Cannot edit more than one row inline at a time';var m8k="ttac";var Y8k="layFields";var J6U=M1R;J6U+=Y8k;var H6U=R5l.R2c;H6U+=m8k;H6U+=f8c;if(countOuter>A5c){throw V8k;}node=$(editField[H6U][A5c]);countInner=A5c;$[u2R](editField[J6U],function(j,f){var Z8k="Cannot edit more than one field inline at a t";if(countInner>A5c){var M6U=Z8k;M6U+=Y9c;throw M6U;}field=f;countInner++;});countOuter++;});if($(k6U,node)[i0R]){return this;}if(this[l6U](function(){var D8k="line";var F5U=f9c;F5U+=H2c;F5U+=D8k;that[F5U](cell,fieldName,opts);})){return this;}this[W5U](cell,editFields,f8k,opts);var namespace=this[L5U](opts);var ret=this[T6k](f8k);if(!ret){return this;}var children=node[b5U]()[d8R]();node[p8R]($(a6k+classes[f6R]+R5U+a6k+classes[g5U]+U6R+E8k+x5U+y5U+classes[Y5U]+m5U+i6R));node[c8k](h8k+classes[V5U][Z5U](/ /g,N8k))[D5U](field[f3k]())[f5U](this[E5U][A8k]);if(opts[c5U]){var A5U=C8R;A5U+=m9c;A5U+=j6R;A5U+=R5l.x2c;var N5U=k2R;N5U+=L9c;N5U+=R5l.R2c;N5U+=e8k;var h5U=R5l.m2c;h5U+=f9c;h5U+=H2c;h5U+=R5l.x2c;node[h5U](h8k+classes[W5k][N5U](/ /g,N8k))[A5U](this[o6R][W5k]);}this[B8k](function(submitComplete){var r8k="contents";var z8k="deta";var K8k="ynamicInfo";var t8k="rD";var i8k="_clea";var B5U=i8k;B5U+=t8k;B5U+=K8k;closed=K0R;$(document)[C8k](L5R+namespace);if(!submitComplete){var e5U=z8k;e5U+=v4c;e5U+=f8c;node[r8k]()[e5U]();node[p8R](children);}that[B5U]();});setTimeout(function(){var i5U=Z9c;i5U+=H2c;if(closed){return;}$(document)[i5U](L5R+namespace,function(e){var w8k="addB";var p8k="andSel";var d8k="rget";var U8k="aren";var U5U=m9c;U5U+=U8k;U5U+=b9c;var r5U=G2c;r5U+=R5l.R2c;r5U+=D8c;r5U+=s9k;var z5U=j3R;z5U+=d8k;var C5U=Z9c;C5U+=m4c;C5U+=H2c;C5U+=R5l.z2c;var K5U=p8k;K5U+=R5l.m2c;var t5U=w8k;t5U+=l2R;t5U+=e9R;var back=$[R5l.S2c][s8k]?t5U:K5U;if(!field[k5R](C5U,e[z5U])&&$[o2R](node[A5c],$(e[r5U])[U5U]()[back]())===-e5c){var d5U=R5l.p2c;d5U+=L9c;d5U+=E8c;d5U+=D8c;that[d5U]();}});},A5c);this[p5U]([field],opts[h2R]);this[D5k](w5U);return this;};Editor[x5R][S6R]=function(name,msg){if(msg===undefined){var s5U=V2R;s5U+=D2k;s5U+=L2R;this[S8k](this[o6R][s5U],name);}else{var S5U=R5l.g2c;S5U+=s0R;S5U+=R5l.Y2c;this[b2k](name)[S5U](msg);}return this;};Editor[x5R][Q5U]=function(mode){var v8k='Not currently in an editing mode';var v5U=Q8k;v5U+=Z9c;v5U+=H2c;if(!mode){return this[R5l.z2c][Q5k];}if(!this[R5l.z2c][Q5k]){throw v8k;}this[R5l.z2c][v5U]=mode;return this;};Editor[x5R][t2k]=function(){return this[R5l.z2c][t2k];};Editor[O5U][T5U]=function(fieldNames){var j8k="multiGet";var a5U=R5l.m2c;a5U+=a3R;a5U+=R5l.x2c;var that=this;if(fieldNames===undefined){var j5U=R5l.m2c;j5U+=f9c;j5U+=R5l.Y2c;j5U+=v3k;fieldNames=this[j5U]();}if($[V9R](fieldNames)){var I5U=R5l.Y2c;I5U+=R5l.R2c;I5U+=v4c;I5U+=f8c;var out={};$[I5U](fieldNames,function(i,name){var O8k="ltiG";var q5U=R5l.g2c;q5U+=E8c;q5U+=O8k;q5U+=D4c;var P5U=R5l.m2c;P5U+=T8k;P5U+=L9c;P5U+=R5l.x2c;out[name]=that[P5U](name)[q5U]();});return out;}return this[a5U](fieldNames)[j8k]();};Editor[n5U][o5U]=function(fieldNames,val){var that=this;if($[G2R](fieldNames)&&val===undefined){var G5U=R5l.Y2c;G5U+=F1R;$[G5U](fieldNames,function(name,value){var u5U=r4c;u5U+=R5l.Y2c;u5U+=L9c;u5U+=R5l.x2c;that[u5U](name)[I8k](value);});}else{var X5U=n3R;X5U+=L9c;X5U+=R5l.x2c;this[X5U](fieldNames)[I8k](val);}return this;};Editor[x5R][f3k]=function(name){var a8k="rde";var l5U=H2c;l5U+=Z9c;l5U+=R5l.x2c;l5U+=R5l.Y2c;var M5U=B0k;M5U+=m9c;var J5U=P8k;J5U+=q8k;var that=this;if(!name){var H5U=Z9c;H5U+=a8k;H5U+=D8c;name=this[H5U]();}return $[J5U](name)?$[M5U](name,function(n){var k5U=n3R;k5U+=L9c;k5U+=R5l.x2c;return that[k5U](n)[f3k]();}):this[b2k](name)[l5U]();};Editor[x5R][F2U]=function(name,fn){var o8k="Name";var W2U=n8k;W2U+=o8k;$(this)[C8k](this[W2U](name),fn);return this;};Editor[x5R][W5R]=function(name,fn){var G8k="_eventName";$(this)[W5R](this[G8k](name),fn);return this;};Editor[x5R][u8k]=function(name,fn){var H8k="Na";var L2U=X8k;L2U+=i7R;L2U+=H8k;L2U+=U7c;$(this)[u8k](this[L2U](name),fn);return this;};Editor[x5R][b2U]=function(){var b7k="eReg";var L7k="_pre";var W7k="ai";var F7k="ler";var l8k="layControl";var k8k="tO";var E2U=V2R;E2U+=J8k;E2U+=R5l.z2c;var f2U=M8k;f2U+=k8k;f2U+=h9k;var D2U=y6R;D2U+=D2R;D2U+=A7c;var Z2U=s0k;Z2U+=W7R;var V2U=R5l.x2c;V2U+=Z9c;V2U+=R5l.g2c;var m2U=Z5R;m2U+=j6R;var Y2U=M1R;Y2U+=l8k;Y2U+=F7k;var y2U=R5l.g2c;y2U+=W7k;y2U+=H2c;var x2U=L7k;x2U+=Z5R;x2U+=R5l.Y2c;x2U+=H2c;var R2U=o7c;R2U+=A9R;R2U+=R5l.z2c;R2U+=b7k;var that=this;this[n3k]();this[R2U](function(submitComplete){var R7k="yCont";var g2U=q6R;g2U+=R7k;g2U+=j0R;g2U+=F7k;that[R5l.z2c][g2U][s8R](that,function(){that[y5k]();});});var ret=this[x2U](y2U);if(!ret){return this;}this[R5l.z2c][Y2U][m2U](this,this[V2U][Z2U]);this[D2U]($[D9k](this[R5l.z2c][I3k],function(name){return that[R5l.z2c][U3k][name];}),this[R5l.z2c][f2U][E2U]);this[D5k](g7k);return this;};Editor[c2U][h2U]=function(set){var Z7k="All fields, and no additional fields, must be provided for ordering.";var Y7k="sli";var x7k="rt";var K2U=R5l.z2c;K2U+=Z9c;K2U+=x7k;var t2U=R5l.z2c;t2U+=L9c;t2U+=f9c;t2U+=e8k;var i2U=A0R;i2U+=y7k;i2U+=H2c;var B2U=R5l.z2c;B2U+=P9c;B2U+=G2c;var e2U=Y7k;e2U+=v4c;e2U+=R5l.Y2c;var A2U=P9c;A2U+=p7c;var N2U=R5l.w2c;N2U+=H2c;N2U+=s2k;if(!set){return this[R5l.z2c][I3k];}if(arguments[N2U]&&!$[V9R](set)){set=Array[x5R][y5R][Y5R](arguments);}if(this[R5l.z2c][A2U][e2U]()[B2U]()[i2U](m7k)!==set[t2U]()[K2U]()[V7k](m7k)){throw Z7k;}$[H3R](this[R5l.z2c][I3k],set);this[n3k]();return this;};Editor[x5R][t9R]=function(items,arg1,arg2,arg3,arg4){var z7k="ton";var A7k="tRemove";var h7k="ltiRemove";var c7k="itMu";var E7k="tions";var D7k="_form";var Q2U=N7c;Q2U+=A7c;var S2U=D7k;S2U+=f7k;S2U+=E7k;var s2U=g0R;s2U+=c7k;s2U+=h7k;var w2U=N7k;w2U+=G2c;var p2U=g0R;p2U+=f9c;p2U+=A7k;var d2U=R5l.x2c;d2U+=f9c;d2U+=Y8R;var U2U=R5l.m2c;U2U+=Z9c;U2U+=D2k;var r2U=R5l.Y2c;r2U+=u6R;r2U+=G2c;r2U+=e7k;var z2U=n3R;z2U+=v3k;var C2U=c2k;C2U+=h2k;C2U+=o5R;C2U+=R5l.z2c;var that=this;if(this[s6k](function(){that[t9R](items,arg1,arg2,arg3,arg4);})){return this;}if(items[i0R]===undefined){items=[items];}var argOpts=this[C2U](arg1,arg2,arg3,arg4);var editFields=this[B7k](z2U,items);this[R5l.z2c][Q5k]=t9R;this[R5l.z2c][t2k]=items;this[R5l.z2c][r2U]=editFields;this[o6R][U2U][O1R][d2U]=Z0k;this[K2k]();this[n8k](p2U,[_pluck(editFields,i7k),_pluck(editFields,J2k),items]);this[w2U](s2U,[editFields,items]);this[z2k]();this[S2U](argOpts[H6R]);argOpts[U2k]();var opts=this[R5l.z2c][t7k];if(opts[Q2U]!==O6R){var T2U=R5l.m2c;T2U+=Z9c;T2U+=K7k;var O2U=R5l.Y2c;O2U+=C7k;var v2U=R5l.p2c;v2U+=L5k;v2U+=z7k;$(v2U,this[o6R][W5k])[O2U](opts[T2U])[h2R]();}return this;};Editor[x5R][G4c]=function(set,val){var j2U=I8c;j2U+=b8c;var that=this;if(!$[G2R](set)){var o={};o[set]=val;set=o;}$[j2U](set,function(n,v){var P2U=R5l.z2c;P2U+=R5l.Y2c;P2U+=G2c;var I2U=R5l.m2c;I2U+=f9c;I2U+=z3R;I2U+=R5l.x2c;that[I2U](n)[P2U](v);});return this;};Editor[q2U][a2U]=function(names,animate){var that=this;$[u2R](this[m9k](names),function(i,n){var n2U=v8R;n2U+=m4c;that[b2k](n)[n2U](animate);});return this;};Editor[o2U][G2U]=function(successCallback,errorCallback,formatdata,hide){var U7k="ces";var r7k="err";var F9U=R5l.Y2c;F9U+=R5l.R2c;F9U+=b8c;var k2U=R5l.Y2c;k2U+=l2R;k2U+=f8c;var M2U=r7k;M2U+=Z9c;M2U+=D8c;var H2U=l2R;H2U+=a4R;var X2U=V7c;X2U+=U7k;X2U+=d7k;var u2U=r4c;u2U+=R5l.Y2c;u2U+=v3k;var that=this,fields=this[R5l.z2c][u2U],errorFields=[],errorReady=A5c,sent=t0R;if(this[R5l.z2c][X2U]||!this[R5l.z2c][H2U]){return this;}this[p7k](K0R);var send=function(){var w7k="_submi";var J2U=w7k;J2U+=G2c;if(errorFields[i0R]!==errorReady||sent){return;}sent=K0R;that[J2U](successCallback,errorCallback,formatdata,hide);};this[M2U]();$[k2U](fields,function(name,field){var l2U=f9c;l2U+=H2c;l2U+=P9k;l2U+=J5R;if(field[l2U]()){errorFields[E0R](name);}});$[F9U](errorFields,function(i,name){var W9U=R5l.A2c;W9U+=t7c;W9U+=D8c;fields[name][W9U](Q1c,function(){errorReady++;send();});});send();return this;};Editor[x5R][s7k]=function(set){var Q7k="templ";var S7k="empla";var b9U=G2c;b9U+=S7k;b9U+=Y8c;if(set===undefined){var L9U=Q7k;L9U+=R5l.R2c;L9U+=Y8c;return this[R5l.z2c][L9U];}this[R5l.z2c][b9U]=$(set);return this;};Editor[R9U][l6k]=function(title){var v7k="heade";var Z9U=f8c;Z9U+=G2c;Z9U+=j9R;var Y9U=i2R;Y9U+=Y8c;Y9U+=i7R;var y9U=v7k;y9U+=D8c;var x9U=O7k;x9U+=H2c;var g9U=v2R;g9U+=R5l.g2c;var header=$(this[g9U][F5k])[x9U](h8k+this[G5R][y9U][Y9U]);if(title===undefined){return header[s2R]();}if(typeof title===R5R){var V9U=G2c;V9U+=v0R;V9U+=L9c;V9U+=R5l.Y2c;var m9U=P2c;m9U+=m9c;m9U+=f9c;title=title(this,new DataTable[m9U](this[R5l.z2c][V9U]));}header[Z9U](title);return this;};Editor[x5R][a2R]=function(field,value){var T7k="PlainObjec";var D9U=f9c;D9U+=R5l.z2c;D9U+=T7k;D9U+=G2c;if(value!==undefined||$[D9U](field)){return this[G4c](field,value);}return this[s9k](field);};var apiRegister=DataTable[j7k][I7k];function __getInst(api){var q7k="oInit";var E9U=g8c;E9U+=f9c;E9U+=K7c;E9U+=D8c;var f9U=i2R;f9U+=P7k;f9U+=G2c;var ctx=api[f9U][A5c];return ctx[q7k][E9U]||ctx[a7k];}function __setBasic(inst,opts,type,plural){var X7k='1';var u7k=/%d/;var A9U=R6k;A9U+=g6k;var c9U=R5l.p2c;c9U+=n7k;c9U+=H2c;c9U+=R5l.z2c;if(!opts){opts={};}if(opts[c9U]===undefined){opts[W5k]=S5k;}if(opts[l6k]===undefined){var N9U=G2c;N9U+=f9c;N9U+=o7k;var h9U=G2c;h9U+=f9c;h9U+=o7k;opts[h9U]=inst[u3R][type][N9U];}if(opts[A9U]===undefined){var e9U=R5k;e9U+=H4c;e9U+=z7c;if(type===e9U){var confirm=inst[u3R][type][G7k];opts[S6R]=plural!==e5c?confirm[k9c][b9R](u7k,plural):confirm[X7k];}else{opts[S6R]=Q1c;}}return opts;}apiRegister(H7k,function(){return __getInst(this);});apiRegister(J7k,function(opts){var inst=__getInst(this);inst[M7k](__setBasic(inst,opts,v6R));return this;});apiRegister(B9U,function(opts){var inst=__getInst(this);inst[u2c](this[A5c][A5c],__setBasic(inst,opts,k7k));return this;});apiRegister(l7k,function(opts){var i9U=R5l.Y2c;i9U+=R5l.x2c;i9U+=l8c;var inst=__getInst(this);inst[i9U](this[A5c],__setBasic(inst,opts,k7k));return this;});apiRegister(F4k,function(opts){var W4k="mov";var t9U=D8c;t9U+=R5l.Y2c;t9U+=W4k;t9U+=R5l.Y2c;var inst=__getInst(this);inst[t9R](this[A5c][A5c],__setBasic(inst,opts,t9U,e5c));return this;});apiRegister(L4k,function(opts){var inst=__getInst(this);inst[t9R](this[A5c],__setBasic(inst,opts,b4k,this[A5c][i0R]));return this;});apiRegister(K9U,function(type,opts){var g4k="ect";var R4k="PlainOb";var z9U=d9R;z9U+=R4k;z9U+=A0R;z9U+=g4k;if(!type){var C9U=f9c;C9U+=H2c;C9U+=L9c;C9U+=q5R;type=C9U;}else if($[z9U](type)){opts=type;type=f8k;}__getInst(this)[type](this[A5c][A5c],opts);return this;});apiRegister(x4k,function(opts){var y4k="bble";var r9U=n9k;r9U+=y4k;__getInst(this)[r9U](this[A5c],opts);return this;});apiRegister(U9U,_api_file);apiRegister(d9U,_api_files);$(document)[W5R](Y4k,function(e,ctx,json){var V4k='dt';var w9U=r4c;w9U+=R5l.w2c;w9U+=R5l.z2c;var p9U=R6R;p9U+=R5l.z2c;p9U+=m4k;p9U+=e8k;if(e[p9U]!==V4k){return;}if(json&&json[w9U]){var S9U=R5l.m2c;S9U+=f9c;S9U+=R5l.w2c;S9U+=R5l.z2c;var s9U=R5l.Y2c;s9U+=R5l.R2c;s9U+=v4c;s9U+=f8c;$[s9U](json[S9U],function(name,files){var Q9U=R5l.m2c;Q9U+=k7c;Q9U+=R5l.Y2c;Q9U+=R5l.z2c;Editor[Q9U][name]=files;});}});Editor[v9U]=function(msg,tn){var Z4k=' For more information, please refer to https://datatables.net/tn/';throw tn?msg+Z4k+tn:msg;};Editor[D4k]=function(data,props,fn){var E4k="rra";var f4k="sA";var j9U=f9c;j9U+=f4k;j9U+=E4k;j9U+=R5l.e2c;var T9U=Q3R;T9U+=L3k;T9U+=A2R;var O9U=R5l.Y2c;O9U+=p2k;O9U+=U2R;var i,ien,dataPoint;props=$[O9U]({label:I2k,value:T9U},props);if($[j9U](data)){var I9U=L9c;I9U+=R5l.Y2c;I9U+=c4k;for(i=A5c,ien=data[I9U];i<ien;i++){dataPoint=data[i];if($[G2R](dataPoint)){var q9U=R5l.R2c;q9U+=G2c;q9U+=G2c;q9U+=D8c;var P9U=h4k;P9U+=z3R;fn(dataPoint[props[N4k]]===undefined?dataPoint[props[P9U]]:dataPoint[props[N4k]],dataPoint[props[A4k]],i,dataPoint[q9U]);}else{fn(dataPoint,dataPoint,i);}}}else{i=A5c;$[u2R](data,function(key,val){fn(val,key,i);i++;});}};Editor[e6R]=function(id){var e4k="ep";var a9U=D8c;a9U+=e4k;a9U+=L9c;a9U+=F9R;return id[a9U](/\./g,m7k);};Editor[B4k]=function(editor,conf,files,progressCallback,completeCallback){var H4k="readAsDataURL";var U4k="onload";var r4k="<i>Uploading file</i>";var z4k="fileReadText";var C4k="ile";var K4k="uploading the f";var t4k="ed while ";var i4k="A server error occurr";var n9U=R5l.Y2c;n9U+=D8c;n9U+=t7c;n9U+=D8c;var reader=new FileReader();var counter=A5c;var ids=[];var generalError=i4k;generalError+=t4k;generalError+=K4k;generalError+=C4k;editor[n9U](conf[R6R],Q1c);progressCallback(conf,conf[z4k]||r4k);reader[U4k]=function(e){var J4k='preSubmit.DTE_Upload';var G4k="plug-in";var o4k="n specified for upload ";var n4k="No Ajax op";var a4k="jax";var q4k="oa";var P4k="ajaxData";var I4k='uploadField';var j4k='upload';var Q4k="isPlainO";var w4k="plo";var p4k="preU";var d4k="js";var f8U=d4k;f8U+=Z9c;f8U+=H2c;var D8U=m9c;D8U+=Z9c;D8U+=R5l.z2c;D8U+=G2c;var Z8U=R5l.Y2c;Z8U+=p2k;Z8U+=U2R;var m8U=H2c;m8U+=R5l.R2c;m8U+=U7c;var Y8U=p4k;Y8U+=w4k;Y8U+=s4k;var y8U=C7c;y8U+=z7c;y8U+=H2c;y8U+=G2c;var R8U=R5l.x2c;R8U+=t7R;R8U+=R5l.R2c;var b8U=R5l.z2c;b8U+=l5k;b8U+=c0R;var F8U=S4k;F8U+=a8c;var M9U=Q4k;M9U+=R5l.p2c;M9U+=B0R;var J9U=S4k;J9U+=a8c;var H9U=v4k;H9U+=R5l.R2c;H9U+=a8c;H9U+=T3R;var X9U=G4R;X9U+=R5l.x2c;var u9U=C8R;u9U+=O4k;var G9U=R5l.R2c;G9U+=e0R;G9U+=T4k;G9U+=H2c;var o9U=C8R;o9U+=V9k;o9U+=R5l.x2c;var data=new FormData();var ajax;data[o9U](G9U,j4k);data[u9U](I4k,conf[R6R]);data[X9U](j4k,files[counter]);if(conf[H9U]){conf[P4k](data);}if(conf[J9U]){ajax=conf[W9k];}else if($[M9U](editor[R5l.z2c][W9k])){var l9U=E8c;l9U+=B9R;l9U+=q4k;l9U+=R5l.x2c;var k9U=R5l.R2c;k9U+=a4k;ajax=editor[R5l.z2c][W9k][B4k]?editor[R5l.z2c][k9U][l9U]:editor[R5l.z2c][W9k];}else if(typeof editor[R5l.z2c][F8U]===W9R){var W8U=S4k;W8U+=a8c;ajax=editor[R5l.z2c][W8U];}if(!ajax){var L8U=n4k;L8U+=f5R;L8U+=o4k;L8U+=G4k;throw L8U;}if(typeof ajax===b8U){ajax={url:ajax};}if(typeof ajax[R8U]===R5R){var g8U=R5l.Y2c;g8U+=l2R;g8U+=f8c;var d={};var ret=ajax[g6R](d);if(ret!==undefined&&typeof ret!==W9R){d=ret;}$[g8U](d,function(key,value){var x8U=r2R;x8U+=U2R;data[x8U](key,value);});}var preRet=editor[y8U](Y8U,[conf[m8U],files[counter],data]);if(preRet===t0R){var V8U=u4k;V8U+=X4k;if(counter<files[V8U]-e5c){counter++;reader[H4k](files[counter]);}else{completeCallback[Y5R](editor,ids);}return;}var submit=t0R;editor[W5R](J4k,function(){submit=K0R;return t0R;});$[W9k]($[Z8U]({},ajax,{type:D8U,data:data,dataType:f8U,contentType:t0R,processData:t0R,xhr:function(){var W1k="onprogress";var F1k="loa";var l4k="oaden";var k4k="nl";var M4k="ajaxSettings";var E8U=a8c;E8U+=f8c;E8U+=D8c;var xhr=$[M4k][E8U]();if(xhr[B4k]){var B8U=Z9c;B8U+=k4k;B8U+=l4k;B8U+=R5l.x2c;var e8U=T2k;e8U+=F1k;e8U+=R5l.x2c;xhr[B4k][W1k]=function(e){var x1k=':';var g1k="%";var R1k="toFixed";var b1k="oad";var L1k="lengthComputable";if(e[L1k]){var A8U=R5l.w2c;A8U+=c4k;var N8U=R5l.w2c;N8U+=c0R;N8U+=X4k;var h8U=G2c;h8U+=Z9c;h8U+=G2c;h8U+=L3k;var c8U=L9c;c8U+=b1k;c8U+=g8c;var percent=(e[c8U]/e[h8U]*u5c)[R1k](A5c)+g1k;progressCallback(conf,files[N8U]===e5c?percent:counter+x1k+files[A8U]+E6R+percent);}};xhr[e8U][B8U]=function(e){var Y1k='Processing';var y1k="processingText";progressCallback(conf,conf[y1k]||Y1k);};}return xhr;},success:function(json){var B1k="URL";var e1k="adAsDat";var D1k="_Upload";var Z1k="preSubmit.DTE";var V1k="ploadXhrSuccess";var r8U=E8c;r8U+=m9c;r8U+=m1k;var t8U=E8c;t8U+=V1k;var i8U=Z1k;i8U+=D1k;editor[C8k](i8U);editor[n8k](t8U,[conf[R6R],json]);if(json[f1k]&&json[f1k][i0R]){var C8U=R5l.w2c;C8U+=H2c;C8U+=s2k;var K8U=E1k;K8U+=Z9c;K8U+=c1k;var errors=json[K8U];for(var i=A5c,ien=errors[C8U];i<ien;i++){editor[H5R](errors[i][R6R],errors[i][h1k]);}}else if(json[H5R]){var z8U=R5l.Y2c;z8U+=N1k;editor[z8U](json[H5R]);}else if(!json[B4k]||!json[r8U][W6R]){editor[H5R](conf[R6R],generalError);}else{var S8U=m9c;S8U+=E8c;S8U+=Q8R;var U8U=R5l.m2c;U8U+=f9c;U8U+=K4c;if(json[U8U]){var p8U=r4c;p8U+=L9c;p8U+=R5l.Y2c;p8U+=R5l.z2c;var d8U=R5l.Y2c;d8U+=R5l.R2c;d8U+=v4c;d8U+=f8c;$[d8U](json[p8U],function(table,files){var s8U=R5l.m2c;s8U+=k7c;s8U+=H7c;var w8U=o2c;w8U+=A1k;if(!Editor[V0R][table]){Editor[V0R][table]={};}$[w8U](Editor[s8U][table],files);});}ids[S8U](json[B4k][W6R]);if(counter<files[i0R]-e5c){var Q8U=R5k;Q8U+=e1k;Q8U+=R5l.R2c;Q8U+=B1k;counter++;reader[Q8U](files[counter]);}else{var v8U=k9R;v8U+=L9c;v8U+=L9c;completeCallback[v8U](editor,ids);if(submit){var O8U=R5l.z2c;O8U+=E8c;O8U+=i1k;O8U+=l8c;editor[O8U]();}}}progressCallback(conf);},error:function(xhr){var C1k='uploadXhrError';var t1k="nam";var j8U=t1k;j8U+=R5l.Y2c;var T8U=k9c;T8U+=K1k;T8U+=G2c;editor[T8U](C1k,[conf[j8U],xhr]);editor[H5R](conf[R6R],generalError);progressCallback(conf);}}));};reader[H4k](files[A5c]);};Editor[x5R][I8U]=function(init){var J0z='initComplete';var q0z="unique";var P0z='form_content';var j0z="events";var v0z="BUTTONS";var Q0z="aTable";var S0z="Tool";var p0z="eat";var U0z='<div data-dte-e="form_buttons" class="';var r0z='"/></div>';var z0z='"><div class="';var C0z='<div data-dte-e="form_error" class="';var K0z='</form>';var t0z='<div data-dte-e="form_content" class="';var i0z="tag";var e0z='<div data-dte-e="foot" class="';var A0z="body";var N0z='<div data-dte-e="body_content" class="';var h0z="legacyAjax";var c0z="dataSources";var D0z="defaul";var Z0z="mTa";var V0z="Tab";var Y0z="ataSourc";var y0z="pti";var x0z="formO";var g0z="templa";var R0z="classe";var b0z="uni";var W0z="te-e=\"processing\" c";var F0z="<div data-d";var l1k="dicat";var k1k="</div>";var M1k="\"><span/>";var J1k="=\"body\" class=\"";var H1k=" data-dte-e";var X1k="tent";var u1k="<form data-dte-e=\"form\" class=";var G1k="o\" c";var o1k="<div data-dte-e=\"form_inf";var n1k="d\" class=\"";var a1k="<div data-dte-e=\"hea";var q1k="head";var I1k="dataTa";var j1k="mCo";var T1k="ody";var O1k="yC";var Q1k="body_conte";var S1k="oces";var w1k="cess";var p1k="dt.dte";var d1k="it.";var U1k=".dt.dte";var r1k="hr";var z1k="iq";var X7U=l7R;X7U+=z1k;X7U+=A2R;var u7U=a8c;u7U+=r1k;u7U+=U1k;var a7U=f9c;a7U+=H2c;a7U+=d1k;a7U+=p1k;var q7U=V7c;q7U+=w1k;q7U+=s1k;var P7U=m9c;P7U+=D8c;P7U+=S1k;P7U+=d7k;var I7U=Q1k;I7U+=i7R;var j7U=v1k;j7U+=O1k;j7U+=m0k;j7U+=G2c;var T7U=R5l.p2c;T7U+=T1k;var O7U=V2R;O7U+=Z9c;O7U+=G2c;var v7U=M6k;v7U+=j1k;v7U+=i7R;v7U+=c1R;var Q7U=Z4R;Q7U+=i4R;var t7U=I1k;t7U+=d6k;var i7U=R5l.p2c;i7U+=L5k;i7U+=G2c;i7U+=P1k;var B7U=q1k;B7U+=R5l.A2c;var e7U=Z3k;e7U+=p7c;var A7U=a1k;A7U+=n1k;var N7U=V2R;N7U+=D8c;N7U+=R5l.g2c;var h7U=o1k;h7U+=G1k;h7U+=A3R;var c7U=R5l.m2c;c7U+=Z9c;c7U+=D8c;c7U+=R5l.g2c;var E7U=G0R;E7U+=l0R;E7U+=u0R;var f7U=u1k;f7U+=G0R;var D7U=N6k;D7U+=u0R;var Z7U=V2R;Z7U+=j0k;var V7U=i5R;V7U+=H2c;V7U+=X1k;var m7U=m4c;m7U+=M7R;m7U+=R5l.A2c;var Y7U=R5l.p2c;Y7U+=Z9c;Y7U+=F8c;var y7U=A6k;y7U+=H1k;y7U+=J1k;var x7U=M1k;x7U+=k1k;var g7U=g0R;g7U+=l1k;g7U+=Z9c;g7U+=D8c;var R7U=a2c;R7U+=g7c;var b7U=F0z;b7U+=W0z;b7U+=A3R;var L7U=k0R;L7U+=L0z;L7U+=b3R;var W7U=R5l.x2c;W7U+=I0R;var F7U=b0z;F7U+=C7k;F7U+=E8c;F7U+=R5l.Y2c;var l8U=H4c;l8U+=S4c;l8U+=L9c;l8U+=R5l.z2c;var k8U=R0z;k8U+=R5l.z2c;var M8U=g0z;M8U+=Y8c;var J8U=x0z;J8U+=y0z;J8U+=Z9c;J8U+=c9k;var H8U=d2R;H8U+=j9R;var X8U=R5l.x2c;X8U+=Y0z;X8U+=R5l.Y2c;X8U+=R5l.z2c;var u8U=m0z;u8U+=R5l.w2c;var G8U=o6R;G8U+=V0z;G8U+=R5l.w2c;var o8U=R5l.R2c;o8U+=A0R;o8U+=R5l.R2c;o8U+=a8c;var n8U=W9k;n8U+=v8c;n8U+=D8c;n8U+=L9c;var a8U=v2R;a8U+=Z0z;a8U+=d6k;var q8U=R5l.g2c;q8U+=N4c;q8U+=W1c;var P8U=D0z;P8U+=G2c;P8U+=R5l.z2c;init=$[H3R](K0R,{},Editor[P8U],init);this[R5l.z2c]=$[H3R](K0R,{},Editor[q8U][F6R],{table:init[a8U]||init[s9R],dbTable:init[f0z]||O6R,ajaxUrl:init[n8U],ajax:init[o8U],idSrc:init[E0z],dataSource:init[G8U]||init[u8U]?Editor[c0z][o1c]:Editor[X8U][H8U],formOptions:init[J8U],legacyAjax:init[h0z],template:init[s7k]?$(init[M8U])[d8R]():O6R});this[G5R]=$[H3R](K0R,{},Editor[k8U]);this[u3R]=init[u3R];Editor[l8U][F6R][F7U]++;var that=this;var classes=this[G5R];this[W7U]={"wrapper":$(L7U+classes[f6R]+U6R+b7U+classes[R7U][g7U]+x7U+y7U+classes[Y7U][m7U]+U6R+N0z+classes[A0z][V7U]+z6R+i6R+e0z+classes[Z7U][f6R]+U6R+a6k+classes[B0z][u8R]+z6R+i6R+D7U)[A5c],"form":$(f7U+classes[n5k][i0z]+U6R+t0z+classes[n5k][u8R]+E7U+K0z)[A5c],"formError":$(C0z+classes[c7U][H5R]+z6R)[A5c],"formInfo":$(h7U+classes[N7U][d6R]+z6R)[A5c],"header":$(A7U+classes[e7U][f6R]+z0z+classes[B7U][u8R]+r0z)[A5c],"buttons":$(U0z+classes[n5k][i7U]+z6R)[A5c]};if($[R5l.S2c][t7U][d0z]){var d7U=R5l.Y2c;d7U+=R5l.x2c;d7U+=l8c;var U7U=v4c;U7U+=D8c;U7U+=p0z;U7U+=R5l.Y2c;var r7U=w0z;r7U+=s0z;var z7U=V0z;z7U+=R5l.w2c;z7U+=S0z;z7U+=R5l.z2c;var C7U=J2c;C7U+=Q0z;var K7U=R5l.m2c;K7U+=H2c;var ttButtons=$[K7U][C7U][z7U][v0z];var i18n=this[r7U];$[u2R]([U7U,d7U,b4k],function(i,val){var T0z="sButtonText";var O0z="or_";var p7U=u2c;p7U+=O0z;ttButtons[p7U+val][T0z]=i18n[val][R8R];});}$[u2R](init[j0z],function(evt,fn){that[W5R](evt,function(){var S7U=R5l.z2c;S7U+=Q9k;S7U+=I0z;var s7U=k9R;s7U+=l9R;var w7U=S9R;w7U+=f9c;w7U+=v4c;w7U+=R5l.Y2c;var args=Array[x5R][w7U][s7U](arguments);args[S7U]();fn[V5R](that,args);});});var dom=this[o6R];var wrapper=dom[Q7U];dom[v7U]=_editor_el(P0z,dom[n5k])[A5c];dom[B0z]=_editor_el(O7U,wrapper)[A5c];dom[A0z]=_editor_el(T7U,wrapper)[A5c];dom[j7U]=_editor_el(I7U,wrapper)[A5c];dom[P7U]=_editor_el(q7U,wrapper)[A5c];if(init[U3k]){this[u5R](init[U3k]);}$(document)[W5R](a7U+this[R5l.z2c][q0z],function(e,settings,json){var a0z="nT";var G7U=G2c;G7U+=R5l.R2c;G7U+=R5l.p2c;G7U+=R5l.w2c;var o7U=a0z;o7U+=D3k;o7U+=R5l.Y2c;var n7U=m0z;n7U+=R5l.w2c;if(that[R5l.z2c][n7U]&&settings[o7U]===$(that[R5l.z2c][G7U])[s9k](A5c)){settings[a7k]=that;}})[W5R](u7U+this[R5l.z2c][X7U],function(e,settings,json){var J7U=o5R;J7U+=D4c;var H7U=H2c;H7U+=F7c;if(json&&that[R5l.z2c][s9R]&&settings[H7U]===$(that[R5l.z2c][s9R])[J7U](A5c)){that[n0z](json);}});try{var k7U=M1R;k7U+=L9c;k7U+=D1R;var M7U=R5l.x2c;M7U+=Z1R;M7U+=D1R;this[R5l.z2c][L8R]=Editor[M7U][init[k7U]][o0z](this);}catch(e){var H0z="controller ";var X0z="lay ";var u0z=" disp";var G0z="Cannot find";var l7U=G0z;l7U+=u0z;l7U+=X0z;l7U+=H0z;throw l7U+init[y8R];}this[n8k](J0z,[]);};Editor[F4U][K2k]=function(){var W3z="Cla";var F3z="addCl";var l0z="lasse";var k0z="ctions";var M0z="move";var x4U=R5k;x4U+=M0z;var R4U=R5l.Y2c;R4U+=R5l.x2c;R4U+=f9c;R4U+=G2c;var b4U=v4c;b4U+=D8c;b4U+=R5l.Y2c;b4U+=O4c;var L4U=R5l.R2c;L4U+=k0z;var W4U=v4c;W4U+=l0z;W4U+=R5l.z2c;var classesActions=this[W4U][L4U];var action=this[R5l.z2c][Q5k];var wrapper=$(this[o6R][f6R]);wrapper[M5R]([classesActions[b4U],classesActions[u2c],classesActions[t9R]][V7k](E6R));if(action===M7k){wrapper[K5R](classesActions[M7k]);}else if(action===R4U){var g4U=F3z;g4U+=B6k;wrapper[g4U](classesActions[u2c]);}else if(action===x4U){var y4U=u5R;y4U+=W3z;y4U+=R5l.z2c;y4U+=R5l.z2c;wrapper[y4U](classesActions[t9R]);}};Editor[Y4U][L3z]=function(data,success,error,submitParams){var G3z='?';var o3z="param";var n3z="rl";var a3z="exOf";var q3z='DELETE';var P3z="isFunction";var I3z="sFunction";var T3z="comple";var O3z="complete";var v3z="xte";var S3z="url";var w3z="dexO";var p3z=/_id_/;var d3z="ajaxUrl";var U3z="O";var r3z="dex";var z3z="Url";var C3z="ja";var K3z=',';var t3z='idSrc';var Z3z="xU";var m3z="nctio";var Y3z="sFu";var y3z="yp";var x3z="Body";var g3z="delete";var R3z="eBody";var b3z="let";var v4U=S4c;v4U+=b3z;v4U+=R3z;var Q4U=g3z;Q4U+=x3z;var S4U=G2c;S4U+=y3z;S4U+=R5l.Y2c;var U4U=E8c;U4U+=D8c;U4U+=L9c;var h4U=f9c;h4U+=Y3z;h4U+=m3z;h4U+=H2c;var c4U=V3z;c4U+=o4R;var E4U=S4k;E4U+=Z3z;E4U+=D8c;E4U+=L9c;var that=this;var action=this[R5l.z2c][Q5k];var thrown;var opts={type:v2k,dataType:O2k,data:O6R,error:[function(xhr,text,err){thrown=err;}],success:[],complete:[function(xhr,text){var i3z="tus";var B3z="responseJSON";var e3z="ON";var A3z="onseJS";var N3z="resp";var h3z="eJSON";var c3z="ars";var E3z="responseText";var f3z="nu";var D3z="sArr";var X5c=204;var D4U=f9c;D4U+=D3z;D4U+=D1R;var m4U=f3z;m4U+=l9R;var json=O6R;if(xhr[h1k]===X5c||xhr[E3z]===m4U){json={};}else{try{var Z4U=m9c;Z4U+=c3z;Z4U+=h3z;var V4U=N3z;V4U+=A3z;V4U+=e3z;json=xhr[B3z]?xhr[V4U]:$[Z4U](xhr[E3z]);}catch(e){}}if($[G2R](json)||$[D4U](json)){var f4U=R5l.z2c;f4U+=G2c;f4U+=R5l.R2c;f4U+=i3z;success(json,xhr[f4U]>=H5c,xhr);}else{error(xhr,text,thrown);}}]};var a;var ajaxSrc=this[R5l.z2c][W9k]||this[R5l.z2c][E4U];var id=action===k7k||action===c4U?_pluck(this[R5l.z2c][B2k],t3z):O6R;if($[V9R](id)){id=id[V7k](K3z);}if($[G2R](ajaxSrc)&&ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if($[h4U](ajaxSrc)){var N4U=R5l.R2c;N4U+=C3z;N4U+=a8c;N4U+=z3z;var uri=O6R;var method=O6R;if(this[R5l.z2c][N4U]){var B4U=D8c;B4U+=R5l.Y2c;B4U+=B9R;B4U+=F9R;var A4U=g0R;A4U+=r3z;A4U+=U3z;A4U+=R5l.m2c;var url=this[R5l.z2c][d3z];if(url[M7k]){uri=url[action];}if(uri[A4U](E6R)!==-e5c){var e4U=R5l.z2c;e4U+=m9c;e4U+=P8c;e4U+=G2c;a=uri[e4U](E6R);method=a[A5c];uri=a[e5c];}uri=uri[B4U](p3z,id);}ajaxSrc(method,uri,data,success,error);return;}else if(typeof ajaxSrc===W9R){var i4U=g0R;i4U+=w3z;i4U+=R5l.m2c;if(ajaxSrc[i4U](E6R)!==-e5c){a=ajaxSrc[s3z](E6R);opts[D9c]=a[A5c];opts[S3z]=a[e5c];}else{opts[S3z]=ajaxSrc;}}else{var r4U=Q3z;r4U+=R5l.Y2c;r4U+=m8c;var z4U=R5l.Y2c;z4U+=N1k;var t4U=R5l.Y2c;t4U+=v3z;t4U+=m8c;var optsCopy=$[t4U]({},ajaxSrc||{});if(optsCopy[O3z]){var C4U=T3z;C4U+=Y8c;var K4U=v4c;K4U+=j3z;K4U+=R5l.w2c;K4U+=Y8c;opts[O3z][m5R](optsCopy[K4U]);delete optsCopy[C4U];}if(optsCopy[z4U]){opts[H5R][m5R](optsCopy[H5R]);delete optsCopy[H5R];}opts=$[r4U]({},opts,optsCopy);}opts[U4U]=opts[S3z][b9R](p3z,id);if(opts[g6R]){var s4U=I3R;s4U+=j3R;var w4U=f9c;w4U+=I3z;var p4U=R5l.x2c;p4U+=R5l.R2c;p4U+=j3R;var d4U=I3R;d4U+=G2c;d4U+=R5l.R2c;var newData=$[P3z](opts[d4U])?opts[g6R](data):opts[p4U];data=$[w4U](opts[s4U])&&newData?newData:$[H3R](K0R,data,newData);}opts[g6R]=data;if(opts[S4U]===q3z&&(opts[Q4U]===undefined||opts[v4U]===K0R)){var j4U=f9c;j4U+=m8c;j4U+=a3z;var T4U=E8c;T4U+=D8c;T4U+=L9c;var O4U=E8c;O4U+=n3z;var params=$[o3z](opts[g6R]);opts[O4U]+=opts[T4U][j4U](G3z)===-e5c?G3z+params:g9R+params;delete opts[g6R];}$[W9k](opts);};Editor[x5R][I4U]=function(){var H3z="bodyContent";var X3z="prepe";var u3z="rmInf";var G4U=R5l.R2c;G4U+=m9c;G4U+=O4k;var o4U=V2R;o4U+=u3z;o4U+=Z9c;var n4U=E7R;n4U+=m8c;var a4U=X3z;a4U+=m8c;var q4U=m4c;q4U+=D8c;q4U+=E7R;q4U+=D8c;var P4U=R5l.x2c;P4U+=Z9c;P4U+=R5l.g2c;var dom=this[P4U];$(dom[q4U])[a4U](dom[F5k]);$(dom[B0z])[p8R](dom[A8k])[n4U](dom[W5k]);$(dom[H3z])[p8R](dom[o4U])[G4U](dom[n5k]);};Editor[u4U][l3k]=function(){var F6z='preBlur';var l3z="editOp";var M4U=R5l.z2c;M4U+=J3z;M4U+=l8c;var J4U=k9c;J4U+=M3z;J4U+=H2c;J4U+=G2c;var H4U=k3z;H4U+=D8c;var X4U=l3z;X4U+=b9c;var opts=this[R5l.z2c][X4U];var onBlur=opts[H4U];if(this[J4U](F6z)===t0R){return;}if(typeof onBlur===R5R){onBlur(this);}else if(onBlur===M4U){this[k3k]();}else if(onBlur===J3k){this[m5k]();}};Editor[k4U][l4U]=function(){var L6z="veClas";var W6z="remo";var y1U=R6k;y1U+=R5l.z2c;y1U+=R5l.R2c;y1U+=D1c;var R1U=W6z;R1U+=L6z;R1U+=R5l.z2c;var b1U=R5l.x2c;b1U+=I0R;var L1U=R5l.m2c;L1U+=T8k;L1U+=W2R;L1U+=R5l.z2c;var W1U=R5l.Y2c;W1U+=D8c;W1U+=D8c;W1U+=P9c;var F1U=R5l.m2c;F1U+=T8k;F1U+=W2R;if(!this[R5l.z2c]){return;}var errorClass=this[G5R][F1U][W1U];var fields=this[R5l.z2c][L1U];$(h8k+errorClass,this[b1U][f6R])[R1U](errorClass);$[u2R](fields,function(name,field){var b6z="sag";var x1U=R5l.g2c;x1U+=H7c;x1U+=b6z;x1U+=R5l.Y2c;var g1U=R5l.A2c;g1U+=D8c;g1U+=Z9c;g1U+=D8c;field[g1U](Q1c)[x1U](Q1c);});this[H5R](Q1c)[y1U](Q1c);};Editor[x5R][Y1U]=function(submitComplete){var V6z="seIcb";var y6z="oseCb";var x6z='preClose';var g6z="Cb";var E1U=C7c;E1U+=R6z;var f1U=R5l.p2c;f1U+=N4c;f1U+=R5l.e2c;var m1U=v4c;m1U+=M3k;m1U+=R5l.Y2c;m1U+=g6z;if(this[n8k](x6z)===t0R){return;}if(this[R5l.z2c][m1U]){var V1U=v4c;V1U+=L9c;V1U+=y6z;this[R5l.z2c][Y6z](submitComplete);this[R5l.z2c][V1U]=O6R;}if(this[R5l.z2c][m6z]){var D1U=q4c;D1U+=Z9c;D1U+=V6z;var Z1U=a4c;Z1U+=V6z;this[R5l.z2c][Z1U]();this[R5l.z2c][D1U]=O6R;}$(f1U)[C8k](Z6z);this[R5l.z2c][Z9k]=t0R;this[E1U](J3k);};Editor[c1U][B8k]=function(fn){this[R5l.z2c][Y6z]=fn;};Editor[x5R][h1U]=function(arg1,arg2,arg3,arg4){var c6z="main";var E6z="but";var f6z="ainObject";var D6z="isP";var N1U=D6z;N1U+=L9c;N1U+=f6z;var that=this;var title;var buttons;var show;var opts;if($[N1U](arg1)){opts=arg1;}else if(typeof arg1===Q6k){show=arg1;opts=arg2;}else{title=arg1;buttons=arg2;show=arg3;opts=arg4;}if(show===undefined){show=K0R;}if(title){that[l6k](title);}if(buttons){var A1U=E6z;A1U+=b5k;that[A1U](buttons);}return{opts:$[H3R]({},this[R5l.z2c][g8R][c6z],opts),maybeOpen:function(){if(show){var e1U=Z9c;e1U+=m9c;e1U+=j6R;that[e1U]();}}};};Editor[B1U][i1U]=function(name){var A6z="ppl";var N6z="shift";var h6z="aSourc";var C1U=J2c;C1U+=h6z;C1U+=R5l.Y2c;var K1U=v4c;K1U+=L3k;K1U+=L9c;var t1U=a2c;t1U+=h4c;t1U+=Z2R;t1U+=R5l.Y2c;var args=Array[t1U][y5R][K1U](arguments);args[N6z]();var fn=this[R5l.z2c][C1U][name];if(fn){var z1U=R5l.R2c;z1U+=A6z;z1U+=R5l.e2c;return fn[z1U](this,args);}};Editor[x5R][r1U]=function(includeFields){var Q6z="ndTo";var t6z="include";var i6z="formContent";var B6z="mai";var e6z="ayO";var X1U=R5l.R2c;X1U+=e0R;X1U+=T4k;X1U+=H2c;var u1U=y8R;u1U+=g8c;var G1U=w4c;G1U+=e6z;G1U+=V2k;G1U+=R5l.A2c;var o1U=C7c;o1U+=z7c;o1U+=H2c;o1U+=G2c;var a1U=R5l.g2c;a1U+=R5l.R2c;a1U+=f9c;a1U+=H2c;var w1U=B6z;w1U+=H2c;var p1U=R5l.g2c;p1U+=Z9c;p1U+=S4c;var d1U=Z9c;d1U+=D8c;d1U+=S4c;d1U+=D8c;var U1U=r4c;U1U+=z9k;var that=this;var formContent=$(this[o6R][i6z]);var fields=this[R5l.z2c][U1U];var order=this[R5l.z2c][d1U];var template=this[R5l.z2c][s7k];var mode=this[R5l.z2c][p1U]||w1U;if(includeFields){this[R5l.z2c][Z5k]=includeFields;}else{var s1U=t6z;s1U+=Z8c;s1U+=K6z;includeFields=this[R5l.z2c][s1U];}formContent[H4R]()[d8R]();$[u2R](order,function(i,fieldOrName){var S6z="field[name=\"";var s6z="editor-";var w6z="emplate=";var p6z="or-t";var d6z="[data-edit";var r6z="ame";var z6z="akIn";var C6z="_we";var Q1U=C6z;Q1U+=z6z;Q1U+=q3k;Q1U+=D1R;var S1U=H2c;S1U+=r6z;var name=fieldOrName instanceof Editor[J3R]?fieldOrName[S1U]():fieldOrName;if(that[Q1U](name,includeFields)!==-e5c){var v1U=R5l.g2c;v1U+=R5l.R2c;v1U+=f9c;v1U+=H2c;if(template&&mode===v1U){var q1U=G0R;q1U+=U6z;var P1U=d6z;P1U+=p6z;P1U+=w6z;P1U+=G0R;var I1U=R5l.R2c;I1U+=I0z;I1U+=R5l.Y2c;I1U+=D8c;var j1U=G0R;j1U+=U6z;var T1U=s6z;T1U+=S6z;var O1U=r4c;O1U+=H2c;O1U+=R5l.x2c;template[O1U](T1U+name+j1U)[I1U](fields[name][f3k]());template[c8k](P1U+name+q1U)[p8R](fields[name][f3k]());}else{formContent[p8R](fields[name][f3k]());}}});if(template&&mode===a1U){var n1U=C8R;n1U+=m9c;n1U+=R5l.Y2c;n1U+=Q6z;template[n1U](formContent);}this[o1U](G1U,[this[R5l.z2c][u1U],this[R5l.z2c][X1U],formContent]);};Editor[x5R][H1U]=function(items,editFields,type,formOptions){var F5z="oString";var n6z="editData";var a6z="ditFie";var q6z="modifi";var P6z="sty";var j6z="orde";var T6z="tEdit";var O6z="ini";var c0b=o0z;c0b+=c8c;c0b+=v6z;var E0b=C7c;E0b+=Q3R;E0b+=R5l.Y2c;E0b+=i7R;var f0b=O6z;f0b+=T6z;var D0b=N7k;D0b+=G2c;var V0b=w2k;V0b+=o5R;V0b+=X4k;var m0b=j6z;m0b+=D8c;var F0b=R5l.x2c;F0b+=I6z;var l1U=P6z;l1U+=L9c;l1U+=R5l.Y2c;var k1U=V2R;k1U+=D2k;var M1U=q6z;M1U+=R5l.Y2c;M1U+=D8c;var J1U=R5l.Y2c;J1U+=a6z;J1U+=v3k;var that=this;var fields=this[R5l.z2c][U3k];var usedFields=[];var includeInOrder;var editData={};this[R5l.z2c][J1U]=editFields;this[R5l.z2c][n6z]=editData;this[R5l.z2c][M1U]=items;this[R5l.z2c][Q5k]=u2c;this[o6R][k1U][l1U][F0b]=r9R;this[R5l.z2c][o4c]=type;this[K2k]();$[u2R](fields,function(name,field){var G6z="multiReset";var o6z="multiId";var Y0b=o6z;Y0b+=R5l.z2c;field[G6z]();includeInOrder=t0R;editData[name]={};$[u2R](editFields,function(idSrc,edit){var k6z="yFields";var M6z="iSet";var J6z="playF";var H6z="isplayF";var X6z="mD";var u6z="cope";if(edit[U3k][name]){var b0b=t7c;b0b+=m4c;var L0b=R5l.z2c;L0b+=u6z;var W0b=T3k;W0b+=X6z;W0b+=t7R;W0b+=R5l.R2c;var val=field[W0b](edit[g6R]);editData[name][idSrc]=val===O6R?Q1c:val;if(!formOptions||formOptions[L0b]===b0b){var x0b=R5l.x2c;x0b+=H6z;x0b+=a3R;x0b+=U4c;var g0b=R5l.x2c;g0b+=d9R;g0b+=J6z;g0b+=K6z;var R0b=R5l.g2c;R0b+=s3k;R0b+=M6z;field[R0b](idSrc,val!==undefined?val:field[F9c]());if(!edit[g0b]||edit[x0b][name]){includeInOrder=K0R;}}else{var y0b=w4c;y0b+=R5l.R2c;y0b+=k6z;if(!edit[l6z]||edit[y0b][name]){field[I8k](idSrc,val!==undefined?val:field[F9c]());includeInOrder=K0R;}}}});if(field[Y0b]()[i0R]!==A5c&&includeInOrder){usedFields[E0R](name);}});var currOrder=this[m0b]()[y5R]();for(var i=currOrder[V0b]-e5c;i>=A5c;i--){var Z0b=G2c;Z0b+=F5z;if($[o2R](currOrder[i][Z0b](),usedFields)===-e5c){currOrder[a3k](i,e5c);}}this[n3k](currOrder);this[D0b](f0b,[_pluck(editFields,i7k)[A5c],_pluck(editFields,J2k)[A5c],items,type]);this[E0b](c0b,[editFields,items,type]);};Editor[h0b][n8k]=function(trigger,args){var V5z="result";var m5z="dler";var Y5z="gerHan";var y5z="rig";var g5z="Cancel";var L5z="Event";var W5z="sult";if(!args){args=[];}if($[V9R](trigger)){for(var i=A5c,ien=trigger[i0R];i<ien;i++){var N0b=k9c;N0b+=R5l.Y2c;N0b+=R6z;this[N0b](trigger[i],args);}}else{var e0b=D8c;e0b+=R5l.Y2c;e0b+=W5z;var A0b=m9c;A0b+=D8c;A0b+=R5l.Y2c;var e=$[L5z](trigger);$(this)[b5z](e,args);if(trigger[R5z](A0b)===A5c&&e[e0b]===t0R){var t0b=g5z;t0b+=e5R;var i0b=x5z;i0b+=R6z;var B0b=G2c;B0b+=y5z;B0b+=Y5z;B0b+=m5z;$(this)[B0b]($[i0b](trigger+t0b),args);}return e[V5z];}};Editor[x5R][K0b]=function(input){var E5z="substring";var f5z="erCase";var D5z="toLo";var Z5z=/^on([A-Z])/;var U0b=A0R;U0b+=Z9c;U0b+=f9c;U0b+=H2c;var C0b=F2k;C0b+=L9c;C0b+=f9c;C0b+=G2c;var name;var names=input[C0b](E6R);for(var i=A5c,ien=names[i0R];i<ien;i++){var z0b=Z7R;z0b+=v4c;z0b+=f8c;name=names[i];var onStyle=name[z0b](Z5z);if(onStyle){var r0b=D5z;r0b+=m4c;r0b+=f5z;name=onStyle[e5c][r0b]()+name[E5z](i5c);}names[i]=name;}return names[U0b](E6R);};Editor[x5R][c5z]=function(node){var p0b=R5l.m2c;p0b+=f9c;p0b+=R5l.Y2c;p0b+=v3k;var d0b=R5l.Y2c;d0b+=F1R;var foundField=O6R;$[d0b](this[R5l.z2c][p0b],function(name,field){var s0b=H2k;s0b+=R5l.x2c;var w0b=v9R;w0b+=R5l.x2c;w0b+=R5l.Y2c;if($(field[w0b]())[s0b](node)[i0R]){foundField=field;}});return foundField;};Editor[S0b][Q0b]=function(fieldNames){var v0b=P8k;v0b+=D8c;v0b+=D8c;v0b+=D1R;if(fieldNames===undefined){return this[U3k]();}else if(!$[v0b](fieldNames)){return[fieldNames];}return fieldNames;};Editor[O0b][T0b]=function(fieldsIn,focus){var t5z="setFocus";var i5z=/^jq:/;var B5z='div.DTE ';var e5z='jq:';var A5z="xOf";var h5z='number';var j0b=R5l.g2c;j0b+=R5l.R2c;j0b+=m9c;var that=this;var field;var fields=$[j0b](fieldsIn,function(fieldOrName){var I0b=R5l.m2c;I0b+=K6z;return typeof fieldOrName===W9R?that[R5l.z2c][I0b][fieldOrName]:fieldOrName;});if(typeof focus===h5z){field=fields[focus];}else if(focus){var P0b=N5z;P0b+=R5l.Y2c;P0b+=A5z;if(focus[P0b](e5z)===A5c){field=$(B5z+focus[b9R](i5z,Q1c));}else{field=this[R5l.z2c][U3k][focus];}}this[R5l.z2c][t5z]=field;if(field){var q0b=R5l.m2c;q0b+=a9k;field[q0b]();}};Editor[a0b][r2k]=function(opts){var u5z="essa";var n5z="blurOnBackg";var a5z="tu";var q5z="onR";var P5z="nReturn";var I5z="submitO";var j5z='submit';var T5z="Blur";var O5z="itOn";var v5z="submitOnBlur";var s5z="closeOnComplete";var w5z='.dteInline';var p5z="tOnReturn";var d5z="ackgro";var U5z="urOnB";var r5z="cti";var C5z="tton";var K5z="yu";var Z3b=e9R;Z3b+=R5l.Y2c;Z3b+=K5z;Z3b+=m9c;var V3b=Z9c;V3b+=H2c;var Y3b=n9k;Y3b+=C5z;Y3b+=R5l.z2c;var x3b=R5l.m2c;x3b+=E8c;x3b+=H2c;x3b+=z5z;var b3b=u2k;b3b+=r5z;b3b+=W5R;var L3b=u4c;L3b+=o7k;var W3b=u4c;W3b+=o7k;var M0b=o9R;M0b+=U5z;M0b+=d5z;M0b+=C0k;var X0b=W7c;X0b+=p5z;var that=this;var inlineCount=__inlineCounter++;var namespace=w5z+inlineCount;if(opts[s5z]!==undefined){var o0b=q4c;o0b+=Z9c;o0b+=T4c;var n0b=S5z;n0b+=Q5z;opts[n0b]=opts[s5z]?o0b:Z0k;}if(opts[v5z]!==undefined){var u0b=R5l.z2c;u0b+=J3z;u0b+=O5z;u0b+=T5z;var G0b=k3z;G0b+=D8c;opts[G0b]=opts[u0b]?j5z:J3k;}if(opts[X0b]!==undefined){var J0b=I5z;J0b+=P5z;var H0b=q5z;H0b+=R5l.Y2c;H0b+=a5z;H0b+=a9R;opts[H0b]=opts[J0b]?j5z:Z0k;}if(opts[M0b]!==undefined){var F3b=z5R;F3b+=R5l.Y2c;var l0b=R5l.p2c;l0b+=L9c;l0b+=E8c;l0b+=D8c;var k0b=n5z;k0b+=m7R;opts[X3k]=opts[k0b]?l0b:F3b;}this[R5l.z2c][t7k]=opts;this[R5l.z2c][o5z]=inlineCount;if(typeof opts[W3b]===W9R||typeof opts[L3b]===b3b){var g3b=G2c;g3b+=G5z;var R3b=G2c;R3b+=f9c;R3b+=o7k;this[l6k](opts[R3b]);opts[g3b]=K0R;}if(typeof opts[S6R]===W9R||typeof opts[S6R]===x3b){var y3b=R5l.g2c;y3b+=u5z;y3b+=D1c;this[S6R](opts[S6R]);opts[y3b]=K0R;}if(typeof opts[Y3b]!==Q6k){var m3b=n9k;m3b+=X5z;m3b+=P1k;this[W5k](opts[m3b]);opts[W5k]=K0R;}$(document)[V3b](Z3b+namespace,function(e){var h2z="eyC";var c2z="yCode";var E2z="ke";var D2z="lose";var Z2z="ur";var V2z="onEsc";var m2z="fault";var Y2z="ventDe";var y2z="preventDefa";var x2z="onReturn";var g2z="canReturnSubmit";var R2z="rnSubmit";var b2z="anRet";var L2z="uncti";var W2z="ment";var F2z="ctiveEle";var l5z="keyC";var k5z="Cod";var M5z="rm_Butto";var J5z="_Fo";var H5z=".DTE";var a5c=39;var q5c=37;var p3b=R5l.w2c;p3b+=c0R;p3b+=X4k;var d3b=H5z;d3b+=J5z;d3b+=M5z;d3b+=c9k;var B3b=H5k;B3b+=k5z;B3b+=R5l.Y2c;var f3b=l5z;f3b+=N4c;f3b+=R5l.Y2c;var D3b=R5l.R2c;D3b+=F2z;D3b+=W2z;var el=$(document[D3b]);if(e[f3b]===d5c&&that[R5l.z2c][Z9k]){var c3b=R5l.m2c;c3b+=L2z;c3b+=Z9c;c3b+=H2c;var E3b=v4c;E3b+=b2z;E3b+=E8c;E3b+=R2z;var field=that[c5z](el);if(field&&typeof field[E3b]===c3b&&field[g2z](el)){var h3b=o3k;h3b+=R5l.p2c;h3b+=v5k;if(opts[x2z]===h3b){var A3b=R5l.z2c;A3b+=J3z;A3b+=f9c;A3b+=G2c;var N3b=y2z;N3b+=s3k;e[N3b]();that[A3b]();}else if(typeof opts[x2z]===R5R){var e3b=m9c;e3b+=R5k;e3b+=Y2z;e3b+=m2z;e[e3b]();opts[x2z](that);}}}else if(e[B3b]===O5c){var z3b=W5R;z3b+=x5z;z3b+=j4R;var t3b=u2k;t3b+=v4c;t3b+=a4R;var i3b=y2z;i3b+=E8c;i3b+=T2R;e[i3b]();if(typeof opts[V2z]===t3b){var K3b=W5R;K3b+=x5z;K3b+=R5l.z2c;K3b+=v4c;opts[K3b](that);}else if(opts[V2z]===x8R){var C3b=R5l.p2c;C3b+=L9c;C3b+=Z2z;that[C3b]();}else if(opts[z3b]===J3k){var r3b=v4c;r3b+=D2z;that[r3b]();}else if(opts[V2z]===j5z){var U3b=o3k;U3b+=i1k;U3b+=f9c;U3b+=G2c;that[U3b]();}}else if(el[f2z](d3b)[p3b]){var v3b=E2z;v3b+=c2z;var w3b=e9R;w3b+=h2z;w3b+=N4c;w3b+=R5l.Y2c;if(e[w3b]===q5c){var Q3b=N7c;Q3b+=E8c;Q3b+=R5l.z2c;var S3b=n9k;S3b+=G2c;S3b+=G2c;S3b+=W5R;var s3b=N2z;s3b+=Q3R;el[s3b](S3b)[Q3b]();}else if(e[v3b]===a5c){var O3b=R5l.p2c;O3b+=E8c;O3b+=C5z;el[A2z](O3b)[h2R]();}}});this[R5l.z2c][m6z]=function(){var e2z="ey";var j3b=e9R;j3b+=e2z;j3b+=E8c;j3b+=m9c;var T3b=Z9c;T3b+=x5k;$(document)[T3b](j3b+namespace);};return namespace;};Editor[x5R][I3b]=function(direction,action,data){var i2z="yAjax";var B2z="leg";var P3b=B2z;P3b+=R5l.R2c;P3b+=v4c;P3b+=i2z;if(!this[R5l.z2c][P3b]||!data){return;}if(direction===t2z){var q3b=M8k;q3b+=G2c;if(action===v6R||action===q3b){var G3b=M8k;G3b+=G2c;var o3b=I3R;o3b+=G2c;o3b+=R5l.R2c;var n3b=R5l.x2c;n3b+=R5l.R2c;n3b+=G2c;n3b+=R5l.R2c;var a3b=I8c;a3b+=b8c;var id;$[a3b](data[n3b],function(rowId,values){var K2z='Editor: Multi-row editing is not supported by the legacy Ajax data format';if(id!==undefined){throw K2z;}id=rowId;});data[o3b]=data[g6R][id];if(action===G3b){data[W6R]=id;}}else{var X3b=R5l.x2c;X3b+=R5l.R2c;X3b+=G2c;X3b+=R5l.R2c;var u3b=R5l.g2c;u3b+=C8R;data[W6R]=$[u3b](data[g6R],function(values,id){return id;});delete data[X3b];}}else{var H3b=R5l.x2c;H3b+=R5l.R2c;H3b+=G2c;H3b+=R5l.R2c;if(!data[g6R]&&data[A3k]){data[g6R]=[data[A3k]];}else if(!data[H3b]){data[g6R]=[];}}};Editor[J3b][n0z]=function(json){var that=this;if(json[C2z]){$[u2R](this[R5l.z2c][U3k],function(name,field){var z2z="update";if(json[C2z][name]!==undefined){var fieldInst=that[b2k](name);if(fieldInst&&fieldInst[z2z]){var M3b=T2k;M3b+=R5l.x2c;M3b+=O4c;fieldInst[M3b](json[C2z][name]);}}});}};Editor[k3b][S8k]=function(el,msg){var s2z="htm";var p2z="tml";var U2z="fadeOut";var r2z="layed";var g6b=e2R;g6b+=m9c;g6b+=r2z;var l3b=R5l.m2c;l3b+=w9R;if(typeof msg===l3b){var F6b=P2c;F6b+=m9c;F6b+=f9c;msg=msg(this,new DataTable[F6b](this[R5l.z2c][s9R]));}el=$(el);if(!msg&&this[R5l.z2c][Z9k]){var W6b=R5l.z2c;W6b+=G2c;W6b+=Z9c;W6b+=m9c;el[W6b]()[U2z](function(){el[s2R](Q1c);});}else if(!msg){var R6b=H2c;R6b+=u8k;var b6b=M1R;b6b+=d2z;var L6b=f8c;L6b+=p2z;el[L6b](Q1c)[a6R](b6b,R6b);}else if(this[R5l.z2c][g6b]){var Y6b=R5l.m2c;Y6b+=R5l.R2c;Y6b+=S4c;Y6b+=w2z;var y6b=s2z;y6b+=L9c;var x6b=k1R;x6b+=Z5R;el[x6b]()[y6b](msg)[Y6b]();}else{var m6b=R5l.p2c;m6b+=A9R;m6b+=Y1c;el[s2R](msg)[a6R](w5R,m6b);}};Editor[V6b][H9R]=function(){var Q2z="wn";var S2z="ultiInfoSho";var D6b=u4k;D6b+=G2c;D6b+=f8c;var Z6b=n3R;Z6b+=v3k;var fields=this[R5l.z2c][Z6b];var include=this[R5l.z2c][Z5k];var show=K0R;var state;if(!include){return;}for(var i=A5c,ien=include[D6b];i<ien;i++){var E6b=R5l.g2c;E6b+=S2z;E6b+=Q2z;var f6b=R5l.g2c;f6b+=v6z;f6b+=v0R;f6b+=R5l.w2c;var field=fields[include[i]];var multiEditable=field[f6b]();if(field[q2R]()&&multiEditable&&show){state=K0R;show=t0R;}else if(field[q2R]()&&!multiEditable){state=K0R;}else{state=t0R;}fields[include[i]][E6b](state);}};Editor[c6b][h6b]=function(type){var q2z='submit.editor-internal';var P2z="ntroller";var I2z="displayCo";var j2z="ureFocu";var T2z="capt";var O2z="r-inte";var v2z="submit.edito";var v6b=l2R;v6b+=G2c;v6b+=T4k;v6b+=H2c;var Q6b=C7c;Q6b+=z7c;Q6b+=i7R;var C6b=R5l.p2c;C6b+=E8c;C6b+=R5l.p2c;C6b+=d6k;var t6b=v2z;t6b+=O2z;t6b+=a9R;t6b+=L3k;var i6b=Z9c;i6b+=H2c;var B6b=Z9c;B6b+=R5l.m2c;B6b+=R5l.m2c;var e6b=R5l.m2c;e6b+=Z9c;e6b+=D8c;e6b+=R5l.g2c;var A6b=T2z;A6b+=j2z;A6b+=R5l.z2c;var N6b=I2z;N6b+=P2z;var that=this;var focusCapture=this[R5l.z2c][N6b][A6b];if(focusCapture===undefined){focusCapture=K0R;}$(this[o6R][e6b])[B6b](q2z)[i6b](t6b,function(e){var n2z="Default";var a2z="prevent";var K6b=a2z;K6b+=n2z;e[K6b]();});if(focusCapture&&(type===g7k||type===C6b)){$(p5R)[W5R](Z6z,function(){var M2z="Fo";var J2z='.DTED';var H2z="veEl";var G2z="iveE";var p6b=m4k;p6b+=R5k;p6b+=H2c;p6b+=b9c;var d6b=o2z;d6b+=G2z;d6b+=L9c;d6b+=u2z;var U6b=L4c;U6b+=x9c;U6b+=o9c;var r6b=m4k;r6b+=D8c;r6b+=X2z;var z6b=Q8k;z6b+=H2z;z6b+=u2z;if($(document[z6b])[r6b](U6b)[i0R]===A5c&&$(document[d6b])[p6b](J2z)[i0R]===A5c){var w6b=R5l.z2c;w6b+=D4c;w6b+=Z8c;w6b+=a9k;if(that[R5l.z2c][w6b]){var S6b=N7c;S6b+=A7c;var s6b=G4c;s6b+=M2z;s6b+=v4c;s6b+=A7c;that[R5l.z2c][s6b][S6b]();}}});}this[H9R]();this[Q6b](k2z,[type,this[R5l.z2c][v6b]]);return K0R;};Editor[x5R][T6k]=function(type){var g9z="Icb";var R9z='cancelOpen';var b9z="cInfo";var L9z="ami";var W9z="clearDyn";var F9z="bubb";var l2z='preOpen';if(this[n8k](l2z,[type,this[R5l.z2c][Q5k]])===t0R){var I6b=F9z;I6b+=R5l.w2c;var j6b=R5l.g2c;j6b+=N4c;j6b+=R5l.Y2c;var T6b=R5l.g2c;T6b+=Z9c;T6b+=R5l.x2c;T6b+=R5l.Y2c;var O6b=k9c;O6b+=W9z;O6b+=L9z;O6b+=b9z;this[O6b]();this[n8k](R9z,[type,this[R5l.z2c][Q5k]]);if((this[R5l.z2c][T6b]===f8k||this[R5l.z2c][j6b]===I6b)&&this[R5l.z2c][m6z]){var P6b=s8R;P6b+=g9z;this[R5l.z2c][P6b]();}this[R5l.z2c][m6z]=O6R;return t0R;}this[R5l.z2c][Z9k]=type;return K0R;};Editor[x5R][q6b]=function(processing){var V9z='div.DTE';var Y9z="ive";var y9z="togg";var x9z="processi";var u6b=x9z;u6b+=c0R;var G6b=k9c;G6b+=M3z;G6b+=i7R;var o6b=y9z;o6b+=R5l.w2c;o6b+=X5R;var n6b=Z4R;n6b+=r2R;n6b+=R5l.A2c;var a6b=o2z;a6b+=Y9z;var procClass=this[G5R][m9z][a6b];$([V9z,this[o6R][n6b]])[o6b](procClass,processing);this[R5l.z2c][m9z]=processing;this[G6b](u6b,[processing]);};Editor[X6b][H6b]=function(successCallback,errorCallback,formatdata,hide){var J9z="_submitTable";var X9z="Com";var u9z="plete";var G9z="nCo";var o9z="nct";var n9z="fu";var a9z="essing";var q9z="_pro";var P9z="plet";var I9z="bmitCom";var T9z='allIfChanged';var O9z='all';var z9z="rocessin";var C9z="ObjectDataFn";var K9z="_fnSet";var t9z="taSo";var B9z="itDa";var e9z="ditOpts";var A9z="initSubmi";var N9z="dbTa";var h9z="crea";var c9z="yAj";var E9z="_legac";var D9z="preS";var Z9z="axUr";var s5b=k9c;s5b+=v4k;s5b+=h7c;var w5b=v4k;w5b+=Z9z;w5b+=L9c;var p5b=S4k;p5b+=a8c;var d5b=D9z;d5b+=f9z;var U5b=E9z;U5b+=c9z;U5b+=h7c;var V5b=R5l.Y2c;V5b+=R5l.x2c;V5b+=f9c;V5b+=G2c;var m5b=h9z;m5b+=Y8c;var Y5b=N9z;Y5b+=R5l.p2c;Y5b+=R5l.w2c;var y5b=o2z;y5b+=f9c;y5b+=W5R;var g5b=l2R;g5b+=G2c;g5b+=R5l.D2c;var R5b=A9z;R5b+=G2c;var b5b=k9c;b5b+=G2k;var L5b=R5l.Y2c;L5b+=e9z;var W5b=R5l.Y2c;W5b+=R5l.x2c;W5b+=B9z;W5b+=j3R;var F5b=M8k;F5b+=i9z;F5b+=A9k;F5b+=i7R;var l6b=n3R;l6b+=v3k;var k6b=I3R;k6b+=t9z;k6b+=E8c;k6b+=e9k;var M6b=K9z;M6b+=C9z;var J6b=R5l.Y2c;J6b+=a8c;J6b+=G2c;var that=this;var i,iLen,eventRet,errorNodes;var changed=t0R,allData={},changedData={};var setBuilder=DataTable[J6b][x6R][M6b];var dataSource=this[R5l.z2c][k6b];var fields=this[R5l.z2c][l6b];var editCount=this[R5l.z2c][F5b];var modifier=this[R5l.z2c][t2k];var editFields=this[R5l.z2c][B2k];var editData=this[R5l.z2c][W5b];var opts=this[R5l.z2c][L5b];var changedSubmit=opts[k3k];var submitParamsLocal;if(this[b5b](R5b,[this[R5l.z2c][g5b]])===t0R){var x5b=x7c;x5b+=z9z;x5b+=o5R;this[x5b](t0R);return;}var action=this[R5l.z2c][y5b];var submitParams={"action":action,"data":{}};if(this[R5l.z2c][Y5b]){submitParams[s9R]=this[R5l.z2c][f0z];}if(action===m5b||action===V5b){var A5b=f2k;A5b+=E2k;var Z5b=R5l.Y2c;Z5b+=R5l.R2c;Z5b+=v4c;Z5b+=f8c;$[Z5b](editFields,function(idSrc,edit){var v9z="isEmptyObject";var allRowData={};var changedRowData={};$[u2R](fields,function(name,field){var S9z="compare";var s9z='-many-count';var w9z=/\[.*$/;var p9z="romData";var d9z="G";var U9z="Of";var r9z="[";if(edit[U3k][name]){var h5b=R5k;h5b+=B9R;h5b+=F9R;var c5b=r9z;c5b+=U6z;var E5b=N5z;E5b+=o2c;E5b+=U9z;var D5b=X3R;D5b+=d9z;D5b+=D4c;var multiGet=field[D5b]();var builder=setBuilder(name);if(multiGet[idSrc]===undefined){var f5b=a2R;f5b+=Z8c;f5b+=p9z;var originalVal=field[f5b](edit[g6R]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=$[V9R](value)&&name[E5b](c5b)!==-e5c?setBuilder(name[h5b](w9z,Q1c)+s9z):O6R;builder(allRowData,value);if(manyBuilder){manyBuilder(allRowData,value[i0R]);}if(action===k7k&&(!editData[name]||!field[S9z](value,editData[name][idSrc]))){builder(changedRowData,value);changed=K0R;if(manyBuilder){var N5b=L9c;N5b+=R5l.Y2c;N5b+=Q9z;N5b+=f8c;manyBuilder(changedRowData,value[N5b]);}}}});if(!$[v9z](allRowData)){allData[idSrc]=allRowData;}if(!$[v9z](changedRowData)){changedData[idSrc]=changedRowData;}});if(action===A5b||changedSubmit===O9z||changedSubmit===T9z&&changed){submitParams[g6R]=allData;}else if(changedSubmit===j9z&&changed){submitParams[g6R]=changedData;}else{var z5b=o3k;z5b+=I9z;z5b+=P9z;z5b+=R5l.Y2c;var C5b=q9z;C5b+=v4c;C5b+=a9z;var t5b=n9z;t5b+=o9z;t5b+=R5l.D2c;var i5b=Z9c;i5b+=G9z;i5b+=R5l.g2c;i5b+=u9z;var B5b=q4c;B5b+=Z9c;B5b+=R5l.z2c;B5b+=R5l.Y2c;var e5b=W5R;e5b+=X9z;e5b+=u9z;this[R5l.z2c][Q5k]=O6R;if(opts[e5b]===B5b&&(hide===undefined||hide)){this[m5k](t0R);}else if(typeof opts[i5b]===t5b){opts[H9z](this);}if(successCallback){var K5b=v4c;K5b+=R5l.R2c;K5b+=l9R;successCallback[K5b](this);}this[C5b](t0R);this[n8k](z5b);return;}}else if(action===t9R){var r5b=I8c;r5b+=b8c;$[r5b](editFields,function(idSrc,edit){submitParams[g6R][idSrc]=edit[g6R];});}this[U5b](t2z,action,submitParams);submitParamsLocal=$[H3R](K0R,{},submitParams);if(formatdata){formatdata(submitParams);}if(this[n8k](d5b,[submitParams,action])===t0R){this[p7k](t0R);return;}var submitWire=this[R5l.z2c][p5b]||this[R5l.z2c][w5b]?this[s5b]:this[J9z];submitWire[Y5R](this,submitParams,function(json,notGood,xhr){var M9z="_submitSuccess";var S5b=R5l.R2c;S5b+=v4c;S5b+=a4R;that[M9z](json,notGood,submitParams,submitParamsLocal,that[R5l.z2c][S5b],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){var k9z="bmitErr";var v5b=Q8k;v5b+=Z9c;v5b+=H2c;var Q5b=t8R;Q5b+=E8c;Q5b+=k9z;Q5b+=P9c;that[Q5b](xhr,err,thrown,errorCallback,submitParams,that[R5l.z2c][v5b]);},submitParams);};Editor[x5R][O5b]=function(data,success,error,submitParams){var x8z='fields';var R8z="ier";var b8z="modi";var L8z="tObjectDataF";var W8z="nGe";var l9z="_fnSetObje";var q5b=l9z;q5b+=F8z;var P5b=Z9c;P5b+=P2c;P5b+=m9c;P5b+=f9c;var I5b=y6R;I5b+=W8z;I5b+=L8z;I5b+=H2c;var j5b=R5l.Y2c;j5b+=a8c;j5b+=G2c;var T5b=R5l.R2c;T5b+=z5z;var that=this;var action=data[T5b];var out={data:[]};var idGet=DataTable[j5b][x6R][I5b](this[R5l.z2c][E0z]);var idSet=DataTable[Q3z][P5b][q5b](this[R5l.z2c][E0z]);if(action!==b4k){var G5b=I3R;G5b+=G2c;G5b+=R5l.R2c;var o5b=I8c;o5b+=b8c;var n5b=b8z;n5b+=R5l.m2c;n5b+=R8z;var a5b=N9k;a5b+=g8z;a5b+=e8k;var originalData=this[a5b](x8z,this[n5b]());$[o5b](data[G5b],function(key,vals){var J5b=y8z;J5b+=f8c;var H5b=f2k;H5b+=R5l.Y2c;H5b+=R5l.R2c;H5b+=Y8c;var toSave;if(action===k7k){var u5b=o2c;u5b+=A1k;var rowData=originalData[key][g6R];toSave=$[u5b](K0R,{},rowData,vals);}else{var X5b=o2c;X5b+=A1k;toSave=$[X5b](K0R,{},vals);}if(action===H5b&&idGet(toSave)===undefined){idSet(toSave,+new Date()+Q1c+key);}else{idSet(toSave,key);}out[g6R][J5b](toSave);});}success(out);};Editor[x5R][M5b]=function(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var q8z='submitSuccess';var P8z="lete";var I8z="onComp";var T8z="ete";var O8z='postRemove';var v8z="ov";var Q8z="preRe";var S8z='postEdit';var s8z="_ev";var w8z="Ed";var p8z="_dataSou";var d8z="reCre";var U8z="Cre";var r8z="pos";var z8z='setData';var C8z='prep';var K8z="com";var t8z='submitUnsuccessful';var f8z='postSubmit';var D8z="_legacyAjax";var Z8z="cei";var V8z="_proces";var Y8z="submitCom";var a2b=Y8z;a2b+=m8z;a2b+=Y8c;var q2b=k9c;q2b+=R5l.Y2c;q2b+=Q3R;q2b+=c1R;var P2b=V8z;P2b+=R5l.z2c;P2b+=s1k;var F2b=E1k;F2b+=P9c;F2b+=R5l.z2c;var l5b=R5k;l5b+=Z8z;l5b+=Q3R;l5b+=R5l.Y2c;var k5b=r4c;k5b+=R5l.Y2c;k5b+=L9c;k5b+=U4c;var that=this;var setData;var fields=this[R5l.z2c][k5b];var opts=this[R5l.z2c][t7k];var modifier=this[R5l.z2c][t2k];this[D8z](l5b,action,json);this[n8k](f8z,[json,submitParams,action,xhr]);if(!json[H5R]){json[H5R]=R5l.E2c;}if(!json[F2b]){json[f1k]=[];}if(notGood||json[H5R]||json[f1k][i0R]){var Z2b=k9c;Z2b+=K1k;Z2b+=G2c;var L2b=R5l.Y2c;L2b+=F1R;var W2b=R5l.Y2c;W2b+=D8c;W2b+=D8c;W2b+=P9c;this[H5R](json[W2b]);$[L2b](json[f1k],function(i,err){var i8z="onFieldError";var B8z="position";var e8z="bodyC";var A8z="eldError";var N8z="nFi";var h8z="dError";var c8z="nFie";var E8z="Error";var field=fields[err[R6R]];field[H5R](err[h1k]||E8z);if(i===A5c){var V2b=Z9c;V2b+=c8z;V2b+=L9c;V2b+=h8z;var R2b=V2R;R2b+=K7k;var b2b=Z9c;b2b+=N8z;b2b+=A8z;if(opts[b2b]===R2b){var m2b=R5l.m2c;m2b+=Z9c;m2b+=J8k;m2b+=R5l.z2c;var Y2b=G2c;Y2b+=Z9c;Y2b+=m9c;var y2b=m4c;y2b+=F7R;y2b+=W7R;var x2b=e8z;x2b+=o0k;var g2b=R5l.x2c;g2b+=I0R;$(that[g2b][x2b],that[R5l.z2c][y2b])[s7R]({"scrollTop":$(field[f3k]())[B8z]()[Y2b]},J5c);field[m2b]();}else if(typeof opts[V2b]===R5R){opts[i8z](that,err);}}});this[Z2b](t8z,[json]);if(errorCallback){errorCallback[Y5R](that,json);}}else{var f2b=f2k;f2b+=R5l.Y2c;f2b+=R5l.R2c;f2b+=Y8c;var D2b=I3R;D2b+=G2c;D2b+=R5l.R2c;var store={};if(json[D2b]&&(action===f2b||action===u2c)){var U2b=R5l.x2c;U2b+=R5l.R2c;U2b+=G2c;U2b+=R5l.R2c;var r2b=K8z;r2b+=v5k;var z2b=b8k;z2b+=G2c;z2b+=K3k;var c2b=Z9R;c2b+=f8c;var E2b=R5l.x2c;E2b+=t7R;E2b+=R5l.R2c;this[B7k](C8z,action,modifier,submitParamsLocal,json,store);for(var i=A5c;i<json[E2b][c2b];i++){setData=json[g6R][i];this[n8k](z8z,[json,setData,action]);if(action===M7k){var B2b=r8z;B2b+=G2c;B2b+=U8z;B2b+=O4c;var e2b=f2k;e2b+=E2k;var A2b=k9c;A2b+=R5l.Y2c;A2b+=z7c;A2b+=i7R;var N2b=m9c;N2b+=d8z;N2b+=t7R;N2b+=R5l.Y2c;var h2b=C7c;h2b+=y2k;h2b+=G2c;this[h2b](N2b,[json,setData]);this[B7k](v6R,fields,setData,store);this[A2b]([e2b,B2b],[json,setData]);}else if(action===u2c){var C2b=R5l.Y2c;C2b+=R5l.x2c;C2b+=l8c;var K2b=p8z;K2b+=e9k;var t2b=N2z;t2b+=w8z;t2b+=f9c;t2b+=G2c;var i2b=s8z;i2b+=R5l.Y2c;i2b+=H2c;i2b+=G2c;this[i2b](t2b,[json,setData]);this[K2b](k7k,modifier,fields,setData,store);this[n8k]([C2b,S8z],[json,setData]);}}this[z2b](r2b,action,modifier,json[U2b],store);}else if(action===t9R){var Q2b=i5R;Q2b+=R5l.g2c;Q2b+=R5l.g2c;Q2b+=l8c;var S2b=D8c;S2b+=R5l.Y2c;S2b+=R5l.g2c;S2b+=o4R;var s2b=k9c;s2b+=R5l.x2c;s2b+=U6k;var w2b=Q8z;w2b+=R5l.g2c;w2b+=v8z;w2b+=R5l.Y2c;var p2b=X8k;p2b+=i7R;var d2b=N2z;d2b+=m9c;this[B7k](d2b,action,modifier,submitParamsLocal,json,store);this[p2b](w2b,[json]);this[s2b](S2b,modifier,fields,store);this[n8k]([b4k,O8z],[json]);this[B7k](Q2b,action,modifier,json[g6R],store);}if(editCount===this[R5l.z2c][o5z]){var j2b=S5z;j2b+=I0R;j2b+=B9R;j2b+=T8z;var v2b=j8z;v2b+=R5l.Y2c;this[R5l.z2c][Q5k]=O6R;if(opts[H9z]===v2b&&(hide===undefined||hide)){var T2b=I3R;T2b+=G2c;T2b+=R5l.R2c;var O2b=o7c;O2b+=M3k;O2b+=R5l.Y2c;this[O2b](json[T2b]?K0R:t0R);}else if(typeof opts[j2b]===R5R){var I2b=I8z;I2b+=P8z;opts[I2b](this);}}if(successCallback){successCallback[Y5R](that,json);}this[n8k](q8z,[json,setData,action]);}this[P2b](t0R);this[q2b](a2b,[json,setData,action]);};Editor[n2b][o2b]=function(xhr,err,thrown,errorCallback,submitParams,action){var u8z='submitComplete';var G8z="system";var o8z="post";var n8z="_process";var a8z="Erro";var H2b=n4c;H2b+=v5k;H2b+=a8z;H2b+=D8c;var X2b=N7k;X2b+=G2c;var u2b=n8z;u2b+=s1k;var G2b=o8z;G2b+=V8c;G2b+=x4c;G2b+=v5k;this[n8k](G2b,[O6R,submitParams,action,xhr]);this[H5R](this[u3R][H5R][G8z]);this[u2b](t0R);if(errorCallback){errorCallback[Y5R](this,xhr,err,thrown);}this[X2b]([H2b,u8z],[xhr,err,thrown,submitParams]);};Editor[J2b][s6k]=function(fn){var l8z="ings";var k8z="sett";var M8z="ures";var J8z="oFe";var H8z="erSide";var X8z="Serv";var g9b=g0R;g9b+=P8c;g9b+=e4c;var k2b=j3R;k2b+=d6k;var M2b=m0z;M2b+=L9c;M2b+=R5l.Y2c;var that=this;var dt=this[R5l.z2c][M2b]?new $[R5l.S2c][o1c][j7k](this[R5l.z2c][k2b]):O6R;var ssp=t0R;if(dt){var W9b=R5l.p2c;W9b+=X8z;W9b+=H8z;var F9b=J8z;F9b+=t7R;F9b+=M8z;var l2b=k8z;l2b+=l8z;ssp=dt[l2b]()[A5c][F9b][W9b];}if(this[R5l.z2c][m9z]){var L9b=W7c;L9b+=i9z;L9b+=Q5z;this[u8k](L9b,function(){var F7z="dra";if(ssp){var R9b=F7z;R9b+=m4c;var b9b=Z9c;b9b+=H2c;b9b+=R5l.Y2c;dt[b9b](R9b,fn);}else{setTimeout(function(){fn();},z5c);}});return K0R;}else if(this[y8R]()===g9b||this[y8R]()===O6k){var x9b=j8z;x9b+=R5l.Y2c;this[u8k](x9b,function(){var W7z="tComplete";if(!that[R5l.z2c][m9z]){setTimeout(function(){fn();},z5c);}else{var Y9b=o3k;Y9b+=R5l.p2c;Y9b+=y4c;Y9b+=W7z;var y9b=Z9c;y9b+=H2c;y9b+=R5l.Y2c;that[y9b](Y9b,function(e,json){if(ssp&&json){var V9b=R5l.x2c;V9b+=D8c;V9b+=R5l.R2c;V9b+=m4c;var m9b=Z9c;m9b+=H2c;m9b+=R5l.Y2c;dt[m9b](V9b,fn);}else{setTimeout(function(){fn();},z5c);}});}})[H3k]();return K0R;}return t0R;};Editor[Z9b][D9b]=function(name,arr){var f9b=Z9R;f9b+=f8c;for(var i=A5c,ien=arr[f9b];i<ien;i++){if(name==arr[i]){return i;}}return-e5c;};Editor[L7z]={"table":O6R,"ajaxUrl":O6R,"fields":[],"display":E9b,"ajax":O6R,"idSrc":b7z,"events":{},"i18n":{"create":{"button":R7z,"title":g7z,"submit":c9b},"edit":{"button":x1c,"title":h9b,"submit":N9b},"remove":{"button":x7z,"title":x7z,"submit":A9b,"confirm":{"_":y7z,"1":e9b}},"error":{"system":Y7z},multi:{title:m7z,info:B9b,restore:i9b,noMulti:V7z},"datetime":{previous:Z7z,next:t9b,months:[D7z,f7z,K9b,C9b,z9b,r9b,E7z,U9b,d9b,c7z,p9b,w9b],weekdays:[h7z,s9b,S9b,N7z,Q9b,v9b,O9b],amPm:[T9b,A7z],unknown:m7k}},formOptions:{bubble:$[j9b]({},Editor[F8R][g8R],{title:t0R,message:t0R,buttons:I9b,submit:j9z}),inline:$[H3R]({},Editor[F8R][g8R],{buttons:t0R,submit:P9b}),main:$[H3R]({},Editor[F8R][g8R])},legacyAjax:t0R};(function(){var m1z="Src";var H4z="[data-ed";var q4z='data-editor-value';var i4z="_fnGetObje";var m4z="cancelled";var Y4z="rowIds";var x4z="_fnGetObjectDataFn";var W4z="oA";var F4z="taFn";var l7z="tDa";var q7z="cells";var t7z="draw";var i7z="taSour";var B7z="dataTabl";var C7b=f8c;C7b+=e7z;C7b+=L9c;var h8b=B7z;h8b+=R5l.Y2c;var q9b=I3R;q9b+=i7z;q9b+=e8k;q9b+=R5l.z2c;var __dataSources=Editor[q9b]={};var __dtIsSsp=function(dt,editor){var z7z="bServerSide";var C7z="oFeatures";var K7z="Type";var a9b=t7z;a9b+=K7z;return dt[F6R]()[A5c][C7z][z7z]&&editor[R5l.z2c][t7k][a9b]!==Z0k;};var __dtApi=function(table){var n9b=p1c;n9b+=d6k;return $(table)[n9b]();};var __dtHighlight=function(node){node=$(node);setTimeout(function(){var U7z='highlight';var r7z="addC";var o9b=r7z;o9b+=L9c;o9b+=R5l.R2c;o9b+=e7R;node[o9b](U7z);setTimeout(function(){var d7z="oHighlig";var M5c=550;var G9b=H2c;G9b+=d7z;G9b+=f8c;G9b+=G2c;node[K5R](G9b)[M5R](U7z);setTimeout(function(){var p7z='noHighlight';node[M5R](p7z);},M5c);},J5c);},s5c);};var __dtRowSelector=function(out,dt,identifier,fields,idFn){var u9b=I8c;u9b+=b8c;dt[M2k](identifier)[w7z]()[u9b](function(idx){var s7z='Unable to find row identifier';var p5c=14;var J9b=D8c;J9b+=Z9c;J9b+=m4c;var H9b=H2c;H9b+=Z9c;H9b+=S4c;var X9b=R5l.x2c;X9b+=F0R;var row=dt[A3k](idx);var data=row[X9b]();var idSrc=idFn(data);if(idSrc===undefined){Editor[H5R](s7z,p5c);}out[idSrc]={idSrc:idSrc,data:data,node:row[H9b](),fields:fields,type:J9b};});};var __dtFieldsFromIdx=function(dt,fields,idx){var P7z='Unable to automatically determine field from source. Please specify the field name.';var j7z="ttings";var T7z="oColumns";var O7z="tFi";var v7z="mDat";var Q7z="tyOb";var S7z="isEmp";var R8b=S7z;R8b+=Q7z;R8b+=B0R;var W8b=v7z;W8b+=R5l.R2c;var F8b=M8k;F8b+=O7z;F8b+=t3k;var l9b=g8c;l9b+=l8c;l9b+=Z8c;l9b+=R1c;var k9b=R5l.R2c;k9b+=T7z;var M9b=T4c;M9b+=j7z;var field;var col=dt[M9b]()[A5c][k9b][idx];var dataSrc=col[l9b]!==undefined?col[F8b]:col[W8b];var resolvedFields={};var run=function(field,dataSrc){if(field[R6R]()===dataSrc){var L8b=w3R;L8b+=U7c;resolvedFields[field[L8b]()]=field;}};$[u2R](fields,function(name,fieldInst){if($[V9R](dataSrc)){var b8b=L9c;b8b+=I7z;b8b+=X4k;for(var i=A5c;i<dataSrc[b8b];i++){run(fieldInst,dataSrc[i]);}}else{run(fieldInst,dataSrc);}});if($[R8b](resolvedFields)){Editor[H5R](P7z,r5c);}return resolvedFields;};var __dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){dt[q7z](identifier)[w7z]()[u2R](function(idx){var u7z="column";var G7z="jec";var o7z="eNam";var n7z="nod";var a7z="displayF";var E8b=o2c;E8b+=G2c;E8b+=R5l.Y2c;E8b+=m8c;var f8b=a7z;f8b+=f9c;f8b+=z9k;var D8b=H2c;D8b+=Z9c;D8b+=R5l.x2c;D8b+=R5l.Y2c;var Z8b=t6k;Z8b+=F1R;var m8b=n7z;m8b+=o7z;m8b+=R5l.Y2c;var Y8b=Z9c;Y8b+=R5l.p2c;Y8b+=G7z;Y8b+=G2c;var y8b=R5l.x2c;y8b+=F0R;var x8b=D8c;x8b+=Z9c;x8b+=m4c;var g8b=v4c;g8b+=R5l.Y2c;g8b+=L9c;g8b+=L9c;var cell=dt[g8b](idx);var row=dt[x8b](idx[A3k]);var data=row[y8b]();var idSrc=idFn(data);var fields=forceFields||__dtFieldsFromIdx(dt,allFields,idx[u7z]);var isNode=typeof identifier===Y8b&&identifier[m8b]||identifier instanceof $;var prevDisplayFields,prevAttach;if(out[idSrc]){var V8b=M1R;V8b+=d2z;V8b+=e7k;prevAttach=out[idSrc][V3k];prevDisplayFields=out[idSrc][V8b];}__dtRowSelector(out,dt,idx[A3k],allFields,idFn);out[idSrc][V3k]=prevAttach||[];out[idSrc][Z8b][E0R](isNode?$(identifier)[s9k](A5c):cell[D8b]());out[idSrc][f8b]=prevDisplayFields||{};$[E8b](out[idSrc][l6z],fields);});};var __dtColumnSelector=function(out,dt,identifier,fields,idFn){var c8b=N5z;c8b+=R5l.Y2c;c8b+=a8c;c8b+=H7c;dt[q7z](O6R,identifier)[c8b]()[u2R](function(idx){__dtCellSelector(out,dt,idx,fields,idFn);});};var __dtjqId=function(id){var H7z='\\$1';var X7z='#';return typeof id===W9R?X7z+id[b9R](/(:|\.|\[|\]|,)/g,H7z):X7z+id;};__dataSources[h8b]={individual:function(identifier,fieldNames){var J7z="nGetObjectDataFn";var A8b=R2k;A8b+=U4c;var N8b=k9c;N8b+=R5l.m2c;N8b+=J7z;var idFn=DataTable[Q3z][x6R][N8b](this[R5l.z2c][E0z]);var dt=__dtApi(this[R5l.z2c][s9R]);var fields=this[R5l.z2c][A8b];var out={};var forceFields;var responsiveNode;if(fieldNames){var e8b=d9R;e8b+=P2c;e8b+=i4c;e8b+=D1R;if(!$[e8b](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[u2R](fieldNames,function(i,name){forceFields[name]=fields[name];});}__dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},fields:function(identifier){var k7z="bjec";var M7z="_fnGetO";var K8b=r4c;K8b+=R5l.Y2c;K8b+=W2R;K8b+=R5l.z2c;var t8b=M7z;t8b+=k7z;t8b+=l7z;t8b+=F4z;var i8b=W4z;i8b+=m9c;i8b+=f9c;var B8b=R5l.Y2c;B8b+=a8c;B8b+=G2c;var idFn=DataTable[B8b][i8b][t8b](this[R5l.z2c][E0z]);var dt=__dtApi(this[R5l.z2c][s9R]);var fields=this[R5l.z2c][K8b];var out={};if($[G2R](identifier)&&(identifier[M2k]!==undefined||identifier[L4z]!==undefined||identifier[q7z]!==undefined)){if(identifier[M2k]!==undefined){var C8b=t7c;C8b+=X2k;__dtRowSelector(out,dt,identifier[C8b],fields,idFn);}if(identifier[L4z]!==undefined){__dtColumnSelector(out,dt,identifier[L4z],fields,idFn);}if(identifier[q7z]!==undefined){var z8b=b4z;z8b+=k4c;__dtCellSelector(out,dt,identifier[z8b],fields,idFn);}}else{__dtRowSelector(out,dt,identifier,fields,idFn);}return out;},create:function(fields,data){var dt=__dtApi(this[R5l.z2c][s9R]);if(!__dtIsSsp(dt,this)){var r8b=t7c;r8b+=m4c;var row=dt[r8b][u5R](data);__dtHighlight(row[f3k]());}},edit:function(identifier,fields,data,store){var y4z="lice";var g4z="tOpts";var d8b=t7z;d8b+=R4z;d8b+=H8c;var U8b=R5l.Y2c;U8b+=u6R;U8b+=g4z;var dt=__dtApi(this[R5l.z2c][s9R]);if(!__dtIsSsp(dt,this)||this[R5l.z2c][U8b][d8b]===Z0k){var O8b=H2c;O8b+=N4c;O8b+=R5l.Y2c;var S8b=R5l.R2c;S8b+=H2c;S8b+=R5l.e2c;var s8b=R5l.R2c;s8b+=H2c;s8b+=R5l.e2c;var w8b=W4z;w8b+=m9c;w8b+=f9c;var p8b=R5l.Y2c;p8b+=a8c;p8b+=G2c;var idFn=DataTable[p8b][w8b][x4z](this[R5l.z2c][E0z]);var rowId=idFn(data);var row;try{row=dt[A3k](__dtjqId(rowId));}catch(e){row=dt;}if(!row[s8b]()){row=dt[A3k](function(rowIdx,rowData,rowNode){return rowId==idFn(rowData);});}if(row[S8b]()){var v8b=F2k;v8b+=y4z;var Q8b=J2c;Q8b+=R5l.R2c;row[Q8b](data);var idx=$[o2R](rowId,store[Y4z]);store[Y4z][v8b](idx,e5c);}else{row=dt[A3k][u5R](data);}__dtHighlight(row[O8b]());}},remove:function(identifier,fields,store){var f4z="every";var D4z="pi";var Z4z="_fnGetObj";var V4z="Sr";var T8b=G2c;T8b+=D3k;T8b+=R5l.Y2c;var dt=__dtApi(this[R5l.z2c][T8b]);var cancelled=store[m4z];if(cancelled[i0R]===A5c){var j8b=D8c;j8b+=Z9c;j8b+=m4c;j8b+=R5l.z2c;dt[j8b](identifier)[t9R]();}else{var G8b=D8c;G8b+=R5l.Y2c;G8b+=H4c;G8b+=z7c;var o8b=D8c;o8b+=Z9c;o8b+=m4c;o8b+=R5l.z2c;var q8b=f9c;q8b+=R5l.x2c;q8b+=V4z;q8b+=v4c;var P8b=Z4z;P8b+=w6k;P8b+=l7z;P8b+=F4z;var I8b=W4z;I8b+=D4z;var idFn=DataTable[Q3z][I8b][P8b](this[R5l.z2c][q8b]);var indexes=[];dt[M2k](identifier)[f4z](function(){var a8b=R5l.x2c;a8b+=R5l.R2c;a8b+=G2c;a8b+=R5l.R2c;var id=idFn(this[a8b]());if($[o2R](id,cancelled)===-e5c){var n8b=f9c;n8b+=H2c;n8b+=R5l.x2c;n8b+=o2c;indexes[E0R](this[n8b]());}});dt[o8b](indexes)[G8b]();}},prep:function(action,identifier,submit,json,store){if(action===k7k){var u8b=J2c;u8b+=R5l.R2c;var cancelled=json[m4z]||[];store[Y4z]=$[D9k](submit[u8b],function(val,key){var c4z="Object";var E4z="isEmpty";var X8b=E4z;X8b+=c4z;return!$[X8b](submit[g6R][key])&&$[o2R](key,cancelled)===-e5c?key:undefined;});}else if(action===b4k){store[m4z]=json[m4z]||[];}},commit:function(action,identifier,data,store){var K4z="any";var t4z="ny";var e4z="dit";var A4z="owI";var N4z="awType";var g7b=H2c;g7b+=Z9c;g7b+=H2c;g7b+=R5l.Y2c;var R7b=h4z;R7b+=N4z;var k8b=w2k;k8b+=s2k;var M8b=D8c;M8b+=A4z;M8b+=R5l.x2c;M8b+=R5l.z2c;var J8b=R5l.Y2c;J8b+=e4z;var H8b=B4z;H8b+=R5l.Y2c;var dt=__dtApi(this[R5l.z2c][H8b]);if(action===J8b&&store[M8b][k8b]){var F7b=i4z;F7b+=F8z;var l8b=R5l.Y2c;l8b+=a8c;l8b+=G2c;var ids=store[Y4z];var idFn=DataTable[l8b][x6R][F7b](this[R5l.z2c][E0z]);var row;var compare=function(id){return function(rowIdx,rowData,rowNode){return id==idFn(rowData);};};for(var i=A5c,ien=ids[i0R];i<ien;i++){var L7b=R5l.R2c;L7b+=t4z;try{var W7b=D8c;W7b+=Z9c;W7b+=m4c;row=dt[W7b](__dtjqId(ids[i]));}catch(e){row=dt;}if(!row[K4z]()){row=dt[A3k](compare(ids[i]));}if(row[L7b]()){var b7b=D8c;b7b+=R5l.Y2c;b7b+=H4c;b7b+=z7c;row[b7b]();}}}var drawType=this[R5l.z2c][t7k][R7b];if(drawType!==g7b){dt[t7z](drawType);}}};function __html_id(identifier){var d4z=" find an element with `data-editor-id` or `id` of: ";var U4z="Could not";var r4z="tor-id=\"";var z4z="[data-edi";var C4z="eyless";var x7b=e9R;x7b+=C4z;var context=document;if(identifier!==x7b){var m7b=L9c;m7b+=R5l.Y2c;m7b+=H2c;m7b+=s2k;var Y7b=w2k;Y7b+=s2k;var y7b=z4z;y7b+=r4z;context=$(y7b+identifier+L0R);if(context[Y7b]===A5c){context=typeof identifier===W9R?$(__dtjqId(identifier)):$(identifier);}if(context[m7b]===A5c){var V7b=U4z;V7b+=d4z;throw V7b+identifier;}}return context;}function __html_el(identifier,name){var S4z="eld=\"";var s4z="or-fi";var w4z="a-edit";var p4z="[dat";var D7b=G0R;D7b+=U6z;var Z7b=p4z;Z7b+=w4z;Z7b+=s4z;Z7b+=S4z;var context=__html_id(identifier);return $(Z7b+name+D7b,context);}function __html_els(identifier,names){var f7b=R5l.w2c;f7b+=H2c;f7b+=Q4z;f7b+=f8c;var out=$();for(var i=A5c,ien=names[f7b];i<ien;i++){out=out[u5R](__html_el(identifier,names[i]));}return out;}function __html_get(identifier,dataSrc){var j4z="e]";var T4z="tor-valu";var O4z="ata-edi";var v4z="[d";var E7b=v4z;E7b+=O4z;E7b+=T4z;E7b+=j4z;var el=__html_el(identifier,dataSrc);return el[I4z](E7b)[i0R]?el[P4z](q4z):el[s2R]();}function __html_set(identifier,fields,data){$[u2R](fields,function(name,field){var o4z='[data-editor-value]';var n4z="aSr";var a4z="FromD";var c7b=a2R;c7b+=a4z;c7b+=F0R;var val=field[c7b](data);if(val!==undefined){var A7b=Z9R;A7b+=f8c;var N7b=X7c;N7b+=G2c;N7b+=R5l.Y2c;N7b+=D8c;var h7b=J2c;h7b+=n4z;h7b+=v4c;var el=__html_el(identifier,field[h7b]());if(el[N7b](o4z)[A7b]){var e7b=R5l.R2c;e7b+=X5z;e7b+=D8c;el[e7b](q4z,val);}else{var K7b=d2R;K7b+=j9R;var B7b=R5l.Y2c;B7b+=R5l.R2c;B7b+=v4c;B7b+=f8c;el[B7b](function(){var X4z="firstChild";var u4z="removeChi";var G4z="childNodes";var i7b=L9c;i7b+=R5l.Y2c;i7b+=Q9z;i7b+=f8c;while(this[G4z][i7b]){var t7b=u4z;t7b+=W2R;this[t7b](this[X4z]);}})[K7b](val);}}});}__dataSources[C7b]={initField:function(cfg){var J4z="itor-label=\"";var r7b=u4k;r7b+=X4k;var z7b=H4z;z7b+=J4z;var label=$(z7b+(cfg[g6R]||cfg[R6R])+L0R);if(!cfg[A4k]&&label[r7b]){cfg[A4k]=label[s2R]();}},individual:function(identifier,fieldNames){var g1z="ata source";var R1z="nnot automatically determine field name from d";var b1z='keyless';var L1z='editor-id';var W1z='andSelf';var F1z='data-editor-field';var l4z="dBack";var k4z="itor-id]";var M4z="eName";var v7b=R5l.Y2c;v7b+=l2R;v7b+=f8c;var Q7b=k9R;Q7b+=L9c;Q7b+=L9c;var S7b=r4c;S7b+=R5l.Y2c;S7b+=W2R;S7b+=R5l.z2c;var s7b=d2R;s7b+=R5l.g2c;s7b+=L9c;var U7b=v9R;U7b+=R5l.x2c;U7b+=M4z;var attachEl;if(identifier instanceof $||identifier[U7b]){var p7b=H4z;p7b+=k4z;var d7b=R5l.R2c;d7b+=R5l.x2c;d7b+=l4z;attachEl=identifier;if(!fieldNames){fieldNames=[$(identifier)[P4z](F1z)];}var back=$[R5l.S2c][s8k]?d7b:W1z;identifier=$(identifier)[f2z](p7b)[back]()[g6R](L1z);}if(!identifier){identifier=b1z;}if(fieldNames&&!$[V9R](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames||fieldNames[i0R]===A5c){var w7b=f7R;w7b+=R1z;w7b+=g1z;throw w7b;}var out=__dataSources[s7b][S7b][Q7b](this,identifier);var fields=this[R5l.z2c][U3k];var forceFields={};$[u2R](fieldNames,function(i,name){forceFields[name]=fields[name];});$[v7b](out,function(id,set){var y1z="toA";var x1z="Fie";var P7b=y8R;P7b+=x1z;P7b+=v3k;var I7b=b2k;I7b+=R5l.z2c;var j7b=y1z;j7b+=D8c;j7b+=B1R;j7b+=R5l.e2c;var T7b=e8k;T7b+=L9c;T7b+=L9c;var O7b=z4c;O7b+=H8c;set[O7b]=T7b;set[V3k]=attachEl?$(attachEl):__html_els(identifier,fieldNames)[j7b]();set[I7b]=fields;set[P7b]=forceFields;});return out;},fields:function(identifier){var Y1z="keyles";var u7b=D8c;u7b+=Z9c;u7b+=m4c;var o7b=R5l.Y2c;o7b+=R5l.R2c;o7b+=v4c;o7b+=f8c;var out={};var self=__dataSources[s2R];if($[V9R](identifier)){for(var i=A5c,ien=identifier[i0R];i<ien;i++){var a7b=v4c;a7b+=R5l.R2c;a7b+=L9c;a7b+=L9c;var q7b=R5l.m2c;q7b+=T8k;q7b+=L9c;q7b+=U4c;var res=self[q7b][a7b](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}var data={};var fields=this[R5l.z2c][U3k];if(!identifier){var n7b=Y1z;n7b+=R5l.z2c;identifier=n7b;}$[o7b](fields,function(name,field){var V1z="valToData";var G7b=R5l.x2c;G7b+=R5l.R2c;G7b+=j3R;G7b+=m1z;var val=__html_get(identifier,field[G7b]());field[V1z](data,val===O6R?undefined:val);});out[identifier]={idSrc:identifier,data:data,node:document,fields:fields,type:u7b};return out;},create:function(fields,data){if(data){var idFn=DataTable[Q3z][x6R][x4z](this[R5l.z2c][E0z]);var id=idFn(data);try{var X7b=R5l.w2c;X7b+=H2c;X7b+=o5R;X7b+=X4k;if(__html_id(id)[X7b]){__html_set(id,fields,data);}}catch(e){}}},edit:function(identifier,fields,data){var Z1z="ctDataF";var M7b=H5k;M7b+=R5l.w2c;M7b+=R5l.z2c;M7b+=R5l.z2c;var J7b=f9c;J7b+=R5l.x2c;J7b+=m1z;var H7b=i4z;H7b+=Z1z;H7b+=H2c;var idFn=DataTable[Q3z][x6R][H7b](this[R5l.z2c][J7b]);var id=idFn(data)||M7b;__html_set(id,fields,data);},remove:function(identifier,fields){var k7b=R5k;k7b+=R5l.g2c;k7b+=Z9c;k7b+=z7c;__html_id(identifier)[k7b]();}};}());Editor[G5R]={"wrapper":T9c,"processing":{"indicator":D1z,"active":m9z},"header":{"wrapper":l7b,"content":f1z},"body":{"wrapper":F4b,"content":W4b},"footer":{"wrapper":E1z,"content":L4b},"form":{"wrapper":b4b,"content":R4b,"tag":R5l.E2c,"info":c1z,"error":g4b,"buttons":x4b,"button":y4b},"field":{"wrapper":C9c,"typePrefix":h1z,"namePrefix":Y4b,"label":N1z,"input":A1z,"inputControl":m4b,"error":V4b,"msg-label":e1z,"msg-error":B1z,"msg-message":i1z,"msg-info":Z4b,"multiValue":D4b,"multiInfo":f4b,"multiRestore":E4b,"multiNoEdit":t1z,"disabled":a5R},"actions":{"create":K1z,"edit":C1z,"remove":z1z},"inline":{"wrapper":r1z,"liner":U1z,"buttons":d1z},"bubble":{"wrapper":p1z,"liner":c4b,"table":w1z,"close":s1z,"pointer":S1z,"bg":h4b}};(function(){var O0n='selectedSingle';var v0n="removeSingle";var Q0n="editSingle";var z0n='buttons-remove';var N0n='buttons-edit';var c0n='selected';var E0n="formButtons";var V0n="i18";var m0n='buttons-create';var J1z="select_single";var H1z="editor_edit";var G1z="BUTTON";var o1z="editor_cr";var a1z="emo";var q1z="editor_r";var P1z="ted";var j1z="editS";var T1z="exten";var O1z="gle";var v1z="selectedSi";var Q1z="Single";var X1b=R5k;X1b+=R5l.g2c;X1b+=o4R;X1b+=Q1z;var u1b=v1z;u1b+=H2c;u1b+=O1z;var G1b=M8k;G1b+=G2c;var o1b=T1z;o1b+=R5l.x2c;var n1b=j1z;n1b+=s1k;n1b+=R5l.w2c;var z1b=D8c;z1b+=Z9c;z1b+=m4c;z1b+=R5l.z2c;var C1b=R5l.z2c;C1b+=I1z;C1b+=P1z;var k4b=R5l.Y2c;k4b+=a8c;k4b+=G2c;k4b+=U2R;if(DataTable[d0z]){var S4b=q1z;S4b+=a1z;S4b+=z7c;var z4b=n1z;z4b+=m8c;var e4b=R5l.Y2c;e4b+=a8c;e4b+=Y8c;e4b+=m8c;var A4b=o1z;A4b+=I8c;A4b+=Y8c;var N4b=G1z;N4b+=V8c;var ttButtons=DataTable[d0z][N4b];var ttButtonBase={sButtonText:O6R,editor:O6R,formTitle:O6R};ttButtons[A4b]=$[e4b](K0R,ttButtons[W8R],ttButtonBase,{formButtons:[{label:O6R,fn:function(e){var B4b=R5l.z2c;B4b+=J3z;B4b+=f9c;B4b+=G2c;this[B4b]();}}],fnClick:function(button,config){var X1z="formBut";var u1z="abel";var C4b=v4c;C4b+=R5k;C4b+=O4c;var K4b=L9c;K4b+=u1z;var t4b=X1z;t4b+=K7c;t4b+=c9k;var i4b=f9c;i4b+=V1c;i4b+=E1c;i4b+=H2c;var editor=config[k2c];var i18nCreate=editor[i4b][M7k];var buttons=config[t4b];if(!buttons[A5c][K4b]){buttons[A5c][A4k]=i18nCreate[k3k];}editor[C4b]({title:i18nCreate[l6k],buttons:buttons});}});ttButtons[H1z]=$[z4b](K0R,ttButtons[J1z],ttButtonBase,{formButtons:[{label:O6R,fn:function(e){this[k3k]();}}],fnClick:function(button,config){var k1z="fnGetSelectedIndexes";var M1z="ormButtons";var s4b=G2c;s4b+=f9c;s4b+=G2c;s4b+=R5l.w2c;var w4b=g8c;w4b+=l8c;var p4b=L9c;p4b+=R5l.R2c;p4b+=p3R;p4b+=L9c;var d4b=R5l.m2c;d4b+=M1z;var U4b=M8k;U4b+=G2c;var r4b=w2k;r4b+=s2k;var selected=this[k1z]();if(selected[r4b]!==e5c){return;}var editor=config[k2c];var i18nEdit=editor[u3R][U4b];var buttons=config[d4b];if(!buttons[A5c][p4b]){buttons[A5c][A4k]=i18nEdit[k3k];}editor[w4b](selected[A5c],{title:i18nEdit[s4b],buttons:buttons});}});ttButtons[S4b]=$[H3R](K0R,ttButtons[l1z],ttButtonBase,{question:O6R,formButtons:[{label:O6R,fn:function(e){var that=this;this[k3k](function(json){var b0n="fnSelectNone";var L0n="Tabl";var W0n="GetInst";var F0n="ataTabl";var T4b=x9c;T4b+=F0n;T4b+=R5l.Y2c;var O4b=B4z;O4b+=R5l.Y2c;var v4b=R5l.S2c;v4b+=W0n;v4b+=g9c;var Q4b=J2c;Q4b+=R5l.R2c;Q4b+=L0n;Q4b+=R5l.Y2c;var tt=$[R5l.S2c][Q4b][d0z][v4b]($(that[R5l.z2c][O4b])[T4b]()[s9R]()[f3k]());tt[b0n]();});}}],fnClick:function(button,config){var x0n="fnGetSelectedIndex";var g0n="mBu";var R0n="confi";var M4b=u4c;M4b+=o7k;var J4b=k2R;J4b+=t3R;J4b+=v4c;J4b+=R5l.Y2c;var H4b=V3z;H4b+=o4R;var u4b=L9c;u4b+=R5l.R2c;u4b+=p3R;u4b+=L9c;var G4b=R0n;G4b+=D8c;G4b+=R5l.g2c;var o4b=u4k;o4b+=G2c;o4b+=f8c;var n4b=w2k;n4b+=o5R;n4b+=G2c;n4b+=f8c;var a4b=V2R;a4b+=D8c;a4b+=g0n;a4b+=o9k;var q4b=R5k;q4b+=R5l.g2c;q4b+=o4R;var P4b=w0z;P4b+=E1c;P4b+=H2c;var I4b=L9c;I4b+=R5l.Y2c;I4b+=c4k;var j4b=x0n;j4b+=H7c;var rows=this[j4b]();if(rows[I4b]===A5c){return;}var editor=config[k2c];var i18nRemove=editor[P4b][q4b];var buttons=config[a4b];var question=typeof i18nRemove[G7k]===W9R?i18nRemove[G7k]:i18nRemove[G7k][rows[n4b]]?i18nRemove[G7k][rows[o4b]]:i18nRemove[G4b][k9c];if(!buttons[A5c][u4b]){var X4b=t3R;X4b+=R5l.p2c;X4b+=R5l.Y2c;X4b+=L9c;buttons[A5c][X4b]=i18nRemove[k3k];}editor[H4b](rows,{message:question[J4b](/%d/g,rows[i0R]),title:i18nRemove[M4b],buttons:buttons});}});}var _buttons=DataTable[Q3z][W5k];$[k4b](_buttons,{create:{text:function(dt,node,config){var Y0n='buttons.create';var y0n="creat";var F1b=y0n;F1b+=R5l.Y2c;var l4b=w0z;l4b+=E1c;l4b+=H2c;return dt[l4b](Y0n,config[k2c][u3R][F1b][R8R]);},className:m0n,editor:O6R,formButtons:{text:function(editor){var L1b=f2k;L1b+=E2k;var W1b=V0n;W1b+=H2c;return editor[W1b][L1b][k3k];},action:function(e){var b1b=R5l.z2c;b1b+=f9z;this[b1b]();}},formMessage:O6R,formTitle:O6R,action:function(e,dt,node,config){var f0n="rmB";var D0n="ormMessa";var Z0n="formT";var x1b=Z0n;x1b+=G5z;var g1b=R5l.m2c;g1b+=D0n;g1b+=D1c;var R1b=V2R;R1b+=f0n;R1b+=T5k;R1b+=P1k;var editor=config[k2c];var buttons=config[R1b];editor[M7k]({buttons:config[E0n],message:config[g1b],title:config[x1b]||editor[u3R][M7k][l6k]});}},edit:{extend:c0n,text:function(dt,node,config){var h0n='buttons.edit';var V1b=R5l.p2c;V1b+=L5k;V1b+=G2c;V1b+=W5R;var m1b=R5l.Y2c;m1b+=R5l.x2c;m1b+=f9c;m1b+=G2c;var Y1b=f9c;Y1b+=V1c;Y1b+=s0z;var y1b=w0z;y1b+=s0z;return dt[y1b](h0n,config[k2c][Y1b][m1b][V1b]);},className:N0n,editor:O6R,formButtons:{text:function(editor){var f1b=R5l.z2c;f1b+=x4c;f1b+=v5k;var D1b=R5l.Y2c;D1b+=R5l.x2c;D1b+=f9c;D1b+=G2c;var Z1b=f9c;Z1b+=V1c;Z1b+=E1c;Z1b+=H2c;return editor[Z1b][D1b][f1b];},action:function(e){this[k3k]();}},formMessage:O6R,formTitle:O6R,action:function(e,dt,node,config){var i0n="exes";var B0n="mMe";var A0n="ormTi";var K1b=G2c;K1b+=G5z;var t1b=R5l.Y2c;t1b+=R5l.x2c;t1b+=l8c;var i1b=R5l.m2c;i1b+=A0n;i1b+=e0n;i1b+=R5l.Y2c;var B1b=M6k;B1b+=B0n;B1b+=R5l.z2c;B1b+=g6k;var e1b=R5l.Y2c;e1b+=u6R;e1b+=G2c;var A1b=L9c;A1b+=j6R;A1b+=o5R;A1b+=X4k;var N1b=b4z;N1b+=L9c;N1b+=R5l.z2c;var h1b=f9c;h1b+=m8c;h1b+=i0n;var c1b=t7c;c1b+=X2k;var E1b=u2c;E1b+=Z9c;E1b+=D8c;var editor=config[E1b];var rows=dt[c1b]({selected:K0R})[w7z]();var columns=dt[L4z]({selected:K0R})[h1b]();var cells=dt[N1b]({selected:K0R})[w7z]();var items=columns[A1b]||cells[i0R]?{rows:rows,columns:columns,cells:cells}:rows;editor[e1b](items,{message:config[B1b],buttons:config[E0n],title:config[i1b]||editor[u3R][t1b][K1b]});}},remove:{extend:C1b,limitTo:[z1b],text:function(dt,node,config){var C0n="ns.remove";var K0n="butto";var t0n="ito";var p1b=R5l.p2c;p1b+=T5k;p1b+=W5R;var d1b=R5l.Y2c;d1b+=R5l.x2c;d1b+=t0n;d1b+=D8c;var U1b=K0n;U1b+=C0n;var r1b=V0n;r1b+=H2c;return dt[r1b](U1b,config[d1b][u3R][t9R][p1b]);},className:z0n,editor:O6R,formButtons:{text:function(editor){var r0n="subm";var s1b=r0n;s1b+=l8c;var w1b=D8c;w1b+=R5l.Y2c;w1b+=H4c;w1b+=z7c;return editor[u3R][w1b][s1b];},action:function(e){this[k3k]();}},formMessage:function(editor,dt){var p0n="nfir";var U0n="irm";var I1b=R5l.w2c;I1b+=c0R;I1b+=G2c;I1b+=f8c;var j1b=M2R;j1b+=F9R;var T1b=L9c;T1b+=I7z;T1b+=G2c;T1b+=f8c;var O1b=i2R;O1b+=R5l.m2c;O1b+=U0n;var v1b=d0n;v1b+=s1k;var Q1b=i5R;Q1b+=p0n;Q1b+=R5l.g2c;var S1b=D8c;S1b+=Z9c;S1b+=m4c;S1b+=R5l.z2c;var rows=dt[S1b]({selected:K0R})[w7z]();var i18n=editor[u3R][t9R];var question=typeof i18n[Q1b]===v1b?i18n[G7k]:i18n[O1b][rows[i0R]]?i18n[G7k][rows[T1b]]:i18n[G7k][k9c];return question[j1b](/%d/g,rows[I1b]);},formTitle:O6R,action:function(e,dt,node,config){var S0n="formTitle";var s0n="rmMessage";var w0n="itl";var a1b=G2c;a1b+=w0n;a1b+=R5l.Y2c;var q1b=f9c;q1b+=V1c;q1b+=E1c;q1b+=H2c;var P1b=R5l.m2c;P1b+=Z9c;P1b+=s0n;var editor=config[k2c];editor[t9R](dt[M2k]({selected:K0R})[w7z](),{buttons:config[E0n],message:config[P1b],title:config[S0n]||editor[q1b][t9R][a1b]});}}});_buttons[n1b]=$[o1b]({},_buttons[G1b]);_buttons[Q0n][H3R]=u1b;_buttons[v0n]=$[H3R]({},_buttons[t9R]);_buttons[X1b][H3R]=O0n;}());Editor[H1b]={};Editor[T0n]=function(input,opts){var Y6n="_constructor";var y6n=/[haA]/;var x6n=/[Hhm]|LT|LTS/;var g6n=/[YMD]|L(?!T)|l/;var R6n='editor-dateime-';var b6n='-time';var L6n='-title';var W6n='-date';var F6n='-error"/>';var J3n='-year"/>';var H3n='<span/>';var X3n='-month"/>';var u3n='<button>';var G3n='-iconLeft">';var o3n='-date">';var I3n='</button>';var j3n="previous";var K3n="Editor datetime: Without momentjs only the format 'YYYY-MM-DD' can be used";var A3n="ults";var N3n=" clas";var h3n="title\">";var f3n="/bu";var Z3n="ght\">";var V3n="-iconRi";var m3n="tton>";var y3n="l\">";var x3n="-lab";var g3n="<sp";var R3n=" cla";var b3n="<select";var L3n="el\">";var W3n="s=\"";var F3n="<select clas";var l0n="calendar\"";var M0n="v cla";var J0n="\">";var H0n="-ti";var X0n="hour";var u0n="/di";var G0n="nda";var o0n="ale";var n0n="-c";var a0n="-e";var q0n="_insta";var P0n="atch";var I0n="tc";var j0n="lendar";var L3S=k9R;L3S+=j0n;var W3S=R5l.x2c;W3S+=I0R;var F3S=r2R;F3S+=R5l.Y2c;F3S+=H2c;F3S+=R5l.x2c;var l0S=u4c;l0S+=e0n;l0S+=R5l.Y2c;var k0S=R5l.x2c;k0S+=I0R;var M0S=C8R;M0S+=m9c;M0S+=R5l.Y2c;M0S+=m8c;var J0S=R5l.x2c;J0S+=Z9c;J0S+=R5l.g2c;var H0S=R5l.Y2c;H0S+=N1k;var X0S=G2c;X0S+=f9c;X0S+=R5l.g2c;X0S+=R5l.Y2c;var u0S=C8R;u0S+=m9c;u0S+=j6R;u0S+=R5l.x2c;var G0S=i2R;G0S+=j3R;G0S+=g0R;G0S+=R5l.A2c;var o0S=R5l.x2c;o0S+=Z9c;o0S+=R5l.g2c;var n0S=Z7R;n0S+=b8c;var a0S=R5l.m2c;a0S+=P9c;a0S+=Z7R;var q0S=R5l.g2c;q0S+=R5l.R2c;q0S+=I0n;q0S+=f8c;var P0S=R5l.g2c;P0S+=P0n;var I0S=M6k;I0S+=Z7R;var j0S=q0n;j0S+=H2c;j0S+=v4c;j0S+=R5l.Y2c;var T0S=a0n;T0S+=D8c;T0S+=J5R;var O0S=n0n;O0S+=o0n;O0S+=G0n;O0S+=D8c;var v0S=R5l.m2c;v0S+=f9c;v0S+=H2c;v0S+=R5l.x2c;var Q0S=R5l.x2c;Q0S+=Z9c;Q0S+=R5l.g2c;var S0S=k0R;S0S+=u0n;S0S+=f8R;var s0S=A6k;s0S+=b3R;var w0S=X0n;w0S+=R5l.z2c;var p0S=H0n;p0S+=R5l.g2c;p0S+=R5l.Y2c;p0S+=J0n;var d0S=k0R;d0S+=u6R;d0S+=M0n;d0S+=H9k;var U0S=k0n;U0S+=l0n;U0S+=l0R;U0S+=u0R;var r0S=V6k;r0S+=G0R;var z0S=F3n;z0S+=W3n;var C0S=k0n;C0S+=h4k;C0S+=L3n;var K0S=s3R;K0S+=M0n;K0S+=e7R;K0S+=E6k;var t0S=n0R;t0S+=f9c;t0S+=Q3R;t0S+=u0R;var i0S=b3n;i0S+=R3n;i0S+=H9k;var B0S=g3n;B0S+=V7R;B0S+=h6k;var e0S=x3n;e0S+=R5l.Y2c;e0S+=y3n;var A0S=D8R;A0S+=Q3R;A0S+=u0R;var N0S=Y3n;N0S+=E8c;N0S+=m3n;var h0S=V3n;h0S+=Z3n;var c0S=k0R;c0S+=D3n;var E0S=k0R;E0S+=f3n;E0S+=E3n;E0S+=c3n;var f0S=A6k;f0S+=b3R;var D0S=k0n;D0S+=h3n;var Z0S=k0R;Z0S+=L0z;Z0S+=N3n;Z0S+=W3n;var V0S=G0R;V0S+=u0R;var m0S=s3R;m0S+=M0n;m0S+=H9k;var J1b=F9c;J1b+=R5l.R2c;J1b+=A3n;this[v4c]=$[H3R](K0R,{},Editor[T0n][J1b],opts);var classPrefix=this[v4c][e3n];var i18n=this[v4c][u3R];if(!window[B3n]&&this[v4c][i3n]!==t3n){throw K3n;}var timeBlock=function(type){var P3n='-iconDown">';var T3n='-timeblock">';var O3n="v class=\"";var v3n="Up\"";var S3n="on>";var s3n="butt";var w3n="el\"";var p3n="-la";var d3n="ct class=\"";var U3n="<sele";var z3n="nex";var y0S=n0R;y0S+=o0R;var x0S=C3n;x0S+=u6R;x0S+=f8R;var g0S=z3n;g0S+=G2c;var R0S=k0R;R0S+=R5l.p2c;R0S+=r3n;R0S+=u0R;var b0S=U3n;b0S+=d3n;var L0S=g3n;L0S+=R5l.R2c;L0S+=H2c;L0S+=h6k;var W0S=p3n;W0S+=R5l.p2c;W0S+=w3n;W0S+=u0R;var F0S=C3n;F0S+=u6R;F0S+=Q3R;F0S+=u0R;var l1b=k0R;l1b+=s3n;l1b+=S3n;var k1b=Q3n;k1b+=v3n;k1b+=u0R;var M1b=s3R;M1b+=O3n;return M1b+classPrefix+T3n+a6k+classPrefix+k1b+l1b+i18n[j3n]+I3n+F0S+a6k+classPrefix+W0S+L0S+b0S+classPrefix+m7k+type+z6R+i6R+a6k+classPrefix+P3n+R0S+i18n[g0S]+I3n+x0S+y0S;};var gap=function(){var n3n="an>";var a3n=":</sp";var q3n="<span>";var Y0S=q3n;Y0S+=a3n;Y0S+=n3n;return Y0S;};var structure=$(m0S+classPrefix+V0S+a6k+classPrefix+o3n+Z0S+classPrefix+D0S+f0S+classPrefix+G3n+u3n+i18n[j3n]+E0S+c0S+a6k+classPrefix+h0S+N0S+i18n[A2z]+I3n+A0S+a6k+classPrefix+e0S+B0S+i0S+classPrefix+X3n+t0S+K0S+classPrefix+C0S+H3n+z0S+classPrefix+J3n+i6R+i6R+r0S+classPrefix+U0S+i6R+d0S+classPrefix+p0S+timeBlock(w0S)+gap()+timeBlock(M3n)+gap()+timeBlock(k3n)+timeBlock(l3n)+i6R+s0S+classPrefix+F6n+S0S);this[Q0S]={container:structure,date:structure[c8k](N8k+classPrefix+W6n),title:structure[c8k](N8k+classPrefix+L6n),calendar:structure[v0S](N8k+classPrefix+O0S),time:structure[c8k](N8k+classPrefix+b6n),error:structure[c8k](N8k+classPrefix+T0S),input:$(input)};this[R5l.z2c]={d:O6R,display:O6R,namespace:R6n+Editor[T0n][j0S]++,parts:{date:this[v4c][I0S][P0S](g6n)!==O6R,time:this[v4c][i3n][q0S](x6n)!==O6R,seconds:this[v4c][i3n][R5z](v1c)!==-e5c,hours12:this[v4c][a0S][n0S](y6n)!==O6R}};this[o0S][G0S][u0S](this[o6R][o2k])[p8R](this[o6R][X0S])[p8R](this[o6R][H0S]);this[J0S][o2k][M0S](this[k0S][l0S])[F3S](this[W3S][L3S]);this[Y6n]();};$[H3R](Editor[T0n][b3S],{destroy:function(){var Z6n='.editor-datetime';var V6n="_hid";var Y3S=Z9c;Y3S+=R5l.m2c;Y3S+=R5l.m2c;var y3S=m6n;y3S+=G2c;var x3S=R5l.x2c;x3S+=Z9c;x3S+=R5l.g2c;var g3S=i5R;g3S+=H2c;g3S+=X2R;g3S+=R5l.A2c;var R3S=V6n;R3S+=R5l.Y2c;this[R3S]();this[o6R][g3S][C8k]()[O5k]();this[x3S][y3S][Y3S](Z6n);},errorMsg:function(msg){var error=this[o6R][H5R];if(msg){var m3S=f8c;m3S+=e7z;m3S+=L9c;error[m3S](msg);}else{error[O5k]();}},hide:function(){this[O8R]();},max:function(date){var f6n="nsTit";var V3S=k9c;V3S+=D6n;V3S+=f6n;V3S+=R5l.w2c;this[v4c][E6n]=date;this[V3S]();this[c6n]();},min:function(date){var A6n="inDa";var N6n="lander";var h6n="_setCa";var D3S=h6n;D3S+=N6n;var Z3S=R5l.g2c;Z3S+=A6n;Z3S+=Y8c;this[v4c][Z3S]=date;this[e6n]();this[D3S]();},owns:function(node){var B6n="rents";var c3S=L9c;c3S+=R5l.Y2c;c3S+=H2c;c3S+=s2k;var E3S=v2R;E3S+=R5l.g2c;var f3S=m9c;f3S+=R5l.R2c;f3S+=B6n;return $(node)[f3S]()[I4z](this[E3S][T5R])[c3S]>A5c;},val:function(set,write){var I6n="toString";var j6n="_dateToUtc";var v6n=/(\d{4})\-(\d{2})\-(\d{2})/;var Q6n="isValid";var s6n="oca";var w6n="ntL";var d6n="tStrict";var U6n="momen";var r6n="toD";var z6n="oment";var C6n="oUtc";var K6n="_dateT";var t6n="rin";var i6n="setUTCD";var U3S=k9c;U3S+=G4c;U3S+=r9c;U3S+=G5z;var r3S=i6n;r3S+=O4c;var z3S=u6R;z3S+=Y8R;var N3S=R5l.z2c;N3S+=G2c;N3S+=t6n;N3S+=o5R;if(set===undefined){return this[R5l.z2c][R5l.x2c];}if(set instanceof Date){var h3S=K6n;h3S+=C6n;this[R5l.z2c][R5l.x2c]=this[h3S](set);}else if(set===O6R||set===Q1c){this[R5l.z2c][R5l.x2c]=O6R;}else if(typeof set===N3S){var A3S=R5l.g2c;A3S+=z6n;if(window[A3S]){var i3S=r6n;i3S+=O4c;var B3S=U6n;B3S+=d6n;var e3S=p6n;e3S+=w6n;e3S+=s6n;e3S+=R5l.w2c;var m=window[B3n][S6n](set,this[v4c][i3n],this[v4c][e3S],this[v4c][B3S]);this[R5l.z2c][R5l.x2c]=m[Q6n]()?m[i3S]():O6R;}else{var t3S=R5l.g2c;t3S+=R5l.R2c;t3S+=G2c;t3S+=b8c;var match=set[t3S](v6n);this[R5l.z2c][R5l.x2c]=match?new Date(Date[O6n](match[e5c],match[B5c]-e5c,match[i5c])):O6R;}}if(write||write===undefined){if(this[R5l.z2c][R5l.x2c]){this[T6n]();}else{var C3S=Q3R;C3S+=R5l.R2c;C3S+=L9c;var K3S=R5l.x2c;K3S+=I0R;this[K3S][O0R][C3S](set);}}if(!this[R5l.z2c][R5l.x2c]){this[R5l.z2c][R5l.x2c]=this[j6n](new Date());}this[R5l.z2c][y8R]=new Date(this[R5l.z2c][R5l.x2c][I6n]());this[R5l.z2c][z3S][r3S](e5c);this[U3S]();this[c6n]();this[P6n]();},_constructor:function(){var w5n="_setTitle";var r5n="hasCla";var K5n="sClass";var e5n='keyup.editor-datetime';var E5n="secondsIncrement";var f5n="_optionsTime";var D5n="ldren";var Z5n="chi";var V5n="hours12";var m5n='span';var Y5n='div.editor-datetime-timeblock';var x5n="hil";var g5n="tim";var R5n="parts";var b5n="onChange";var l6n="contai";var k6n="im";var J6n="ho";var H6n="12";var X6n="ncr";var u6n="utesI";var o6n="P";var a6n="focus.editor-datetime click.editor-dat";var q6n="ont";var X6S=v4c;X6S+=a1R;var t6S=R5l.z2c;t6S+=z3R;t6S+=w6k;t6S+=G2c;var i6S=v4c;i6S+=q6n;i6S+=R5l.R2c;i6S+=d5R;var B6S=R5l.x2c;B6S+=Z9c;B6S+=R5l.g2c;var Y6S=a6n;Y6S+=M2c;var y6S=Z9c;y6S+=H2c;var x6S=f9c;x6S+=n6n;x6S+=G2c;var g6S=R5l.R2c;g6S+=R5l.g2c;g6S+=o6n;g6S+=R5l.g2c;var R6S=m9c;R6S+=R5l.g2c;var b6S=q3R;b6S+=m9c;b6S+=R5l.g2c;var L6S=G6n;L6S+=u6n;L6S+=X6n;L6S+=u2z;var W6S=f8c;W6S+=g8z;W6S+=R5l.z2c;W6S+=H6n;var F6S=J6n;F6S+=E8c;F6S+=c1k;var J3S=M6n;J3S+=b9c;var a3S=T4c;a3S+=i2R;a3S+=R5l.x2c;a3S+=R5l.z2c;var q3S=M6n;q3S+=G2c;q3S+=R5l.z2c;var v3S=G2c;v3S+=k6n;v3S+=R5l.Y2c;var S3S=I3R;S3S+=G2c;S3S+=R5l.Y2c;var s3S=f9c;s3S+=V1c;s3S+=E1c;s3S+=H2c;var w3S=l6n;w3S+=h9R;var p3S=R5l.x2c;p3S+=Z9c;p3S+=R5l.g2c;var d3S=F5n;d3S+=W5n;d3S+=L5n;var that=this;var classPrefix=this[v4c][d3S];var container=this[p3S][w3S];var i18n=this[v4c][s3S];var onChange=this[v4c][b5n];if(!this[R5l.z2c][R5n][S3S]){var Q3S=H2c;Q3S+=W5R;Q3S+=R5l.Y2c;this[o6R][o2k][a6R](w5R,Q3S);}if(!this[R5l.z2c][R5n][v3S]){var P3S=v9R;P3S+=H2c;P3S+=R5l.Y2c;var I3S=R5l.x2c;I3S+=d9R;I3S+=B9R;I3S+=D1R;var j3S=f5k;j3S+=R5l.z2c;var T3S=g5n;T3S+=R5l.Y2c;var O3S=R5l.x2c;O3S+=I0R;this[O3S][T3S][j3S](I3S,P3S);}if(!this[R5l.z2c][q3S][a3S]){var H3S=R5k;H3S+=H4c;H3S+=z7c;var X3S=O7k;X3S+=H2c;var u3S=G2c;u3S+=Y9c;var G3S=R5l.Y2c;G3S+=C7k;var o3S=v4c;o3S+=x5n;o3S+=F4R;var n3S=R5l.x2c;n3S+=Z9c;n3S+=R5l.g2c;this[n3S][y5n][o3S](Y5n)[G3S](B5c)[t9R]();this[o6R][u3S][X3S](m5n)[H6k](e5c)[H3S]();}if(!this[R5l.z2c][J3S][V5n]){var l3S=L9c;l3S+=R5l.R2c;l3S+=R5l.z2c;l3S+=G2c;var k3S=Z5n;k3S+=D5n;var M3S=G2c;M3S+=f9c;M3S+=R5l.g2c;M3S+=R5l.Y2c;this[o6R][M3S][k3S](Y5n)[l3S]()[t9R]();}this[e6n]();this[f5n](F6S,this[R5l.z2c][R5n][W6S]?U5c:Q5c,e5c);this[f5n](M3n,G5c,this[v4c][L6S]);this[f5n](k3n,G5c,this[v4c][E5n]);this[c5n](b6S,[h5n,R6S],i18n[g6S]);this[o6R][x6S][y6S](Y6S,function(){var A5n="visible";var E6S=t8R;E6S+=J6n;E6S+=m4c;var f6S=Q3R;f6S+=R5l.R2c;f6S+=L9c;var D6S=f9c;D6S+=N5n;D6S+=L5k;var Z6S=l6R;Z6S+=L9c;var V6S=v9k;V6S+=Y9k;V6S+=R5l.x2c;var m6S=v9k;m6S+=A5n;if(that[o6R][T5R][d9R](m6S)||that[o6R][O0R][d9R](V6S)){return;}that[Z6S](that[o6R][D6S][f6S](),t0R);that[E6S]();})[W5R](e5n,function(){var B5n=":visibl";var h6S=B5n;h6S+=R5l.Y2c;var c6S=f9c;c6S+=R5l.z2c;if(that[o6R][T5R][c6S](h6S)){var e6S=Q3R;e6S+=R5l.R2c;e6S+=L9c;var A6S=R5l.x2c;A6S+=I0R;var N6S=Q3R;N6S+=R5l.R2c;N6S+=L9c;that[N6S](that[A6S][O0R][e6S](),t0R);}});this[B6S][i6S][W5R](i5n,t6S,function(){var k5n="Seconds";var M5n="rit";var J5n="_w";var H5n='-seconds';var X5n="etUTCMinut";var u5n="etTim";var G5n="utput";var o5n="eO";var n5n="_wr";var a5n='-minutes';var q5n="urs";var P5n="etUTCHo";var I5n='-hours';var j5n="Hou";var v5n='-ampm';var Q5n="setUTCFullYear";var S5n="_setT";var s5n='-year';var d5n="rrectM";var C5n="hasCl";var u6S=t5n;u6S+=T4k;u6S+=H2c;var G6S=N7c;G6S+=A7c;var o6S=m6n;o6S+=G2c;var j6S=I7R;j6S+=K5n;var w6S=k0n;w6S+=f8c;w6S+=g8z;w6S+=R5l.z2c;var p6S=C5n;p6S+=B6k;var z6S=k0n;z6S+=z5n;var C6S=r5n;C6S+=e7R;var K6S=Q3R;K6S+=R5l.R2c;K6S+=L9c;var select=$(this);var val=select[K6S]();if(select[C6S](classPrefix+z6S)){var r6S=U5n;r6S+=d5n;r6S+=p5n;that[r6S](that[R5l.z2c][y8R],val);that[w5n]();that[c6n]();}else if(select[M6R](classPrefix+s5n)){var d6S=S5n;d6S+=l8c;d6S+=R5l.w2c;var U6S=w4c;U6S+=D1R;that[R5l.z2c][U6S][Q5n](val);that[d6S]();that[c6n]();}else if(select[p6S](classPrefix+w6S)||select[M6R](classPrefix+v5n)){if(that[R5l.z2c][R5n][V5n]){var O6S=O5n;O6S+=T5n;O6S+=j5n;O6S+=c1k;var v6S=m9c;v6S+=R5l.g2c;var Q6S=k0n;Q6S+=q3R;Q6S+=m9c;Q6S+=R5l.g2c;var S6S=R5l.x2c;S6S+=I0R;var s6S=Q3R;s6S+=R5l.R2c;s6S+=L9c;var hours=$(that[o6R][T5R])[c8k](N8k+classPrefix+I5n)[s6S]()*e5c;var pm=$(that[S6S][T5R])[c8k](N8k+classPrefix+Q6S)[a2R]()===v6S;that[R5l.z2c][R5l.x2c][O6S](hours===U5c&&!pm?A5c:pm&&hours!==U5c?hours+U5c:hours);}else{var T6S=R5l.z2c;T6S+=P5n;T6S+=q5n;that[R5l.z2c][R5l.x2c][T6S](val);}that[P6n]();that[T6n](K0R);onChange();}else if(select[j6S](classPrefix+a5n)){var q6S=n5n;q6S+=l8c;q6S+=o5n;q6S+=G5n;var P6S=t8R;P6S+=u5n;P6S+=R5l.Y2c;var I6S=R5l.z2c;I6S+=X5n;I6S+=R5l.Y2c;I6S+=R5l.z2c;that[R5l.z2c][R5l.x2c][I6S](val);that[P6S]();that[q6S](K0R);onChange();}else if(select[M6R](classPrefix+H5n)){var n6S=J5n;n6S+=M5n;n6S+=R3k;n6S+=f2R;var a6S=G4c;a6S+=k5n;that[R5l.z2c][R5l.x2c][a6S](val);that[P6n]();that[n6S](K0R);onChange();}that[o6R][o6S][G6S]();that[u6S]();})[W5R](X6S,function(e){var v2n='day';var w2n="ateTo";var p2n="tUTCDat";var d2n="etUTCFullYea";var U2n="art";var r2n="change";var C2n='-iconDown';var K2n="selectedIndex";var t2n="ctedInde";var B2n="pt";var e2n="han";var A2n='-iconUp';var h2n="_correctMonth";var c2n="_setCal";var f2n="CM";var Z2n="ander";var V2n="etCal";var m2n='-iconLeft';var x2n="sC";var g2n="Righ";var R2n='button';var b2n='select';var L2n="nodeName";var W2n="ase";var F2n="oLowerC";var l5n="topPropagation";var M6S=R5l.z2c;M6S+=l5n;var J6S=G2c;J6S+=F2n;J6S+=W2n;var H6S=G2c;H6S+=z8c;H6S+=D1c;H6S+=G2c;var nodeName=e[H6S][L2n][J6S]();if(nodeName===b2n){return;}e[M6S]();if(nodeName===R2n){var h5S=r5n;h5S+=e7R;var m5S=I7R;m5S+=K5n;var g5S=Q3n;g5S+=g2n;g5S+=G2c;var R5S=I7R;R5S+=x2n;R5S+=y2n;R5S+=R5l.z2c;var button=$(e[a7R]);var parent=button[r5R]();var select;if(parent[M6R](Y2n)){return;}if(parent[M6R](classPrefix+m2n)){var b5S=R5l.m2c;b5S+=Z9c;b5S+=K7k;var L5S=f9c;L5S+=H2c;L5S+=m9c;L5S+=L5k;var W5S=R5l.x2c;W5S+=Z9c;W5S+=R5l.g2c;var F5S=t8R;F5S+=V2n;F5S+=Z2n;var l6S=s9k;l6S+=D2n;l6S+=f2n;l6S+=p5n;var k6S=q6R;k6S+=R5l.e2c;that[R5l.z2c][y8R][E2n](that[R5l.z2c][k6S][l6S]()-e5c);that[w5n]();that[F5S]();that[W5S][L5S][b5S]();}else if(parent[R5S](classPrefix+g5S)){var Y5S=f9c;Y5S+=H2c;Y5S+=m9c;Y5S+=L5k;var y5S=c2n;y5S+=Z2n;var x5S=R5l.x2c;x5S+=I6z;that[h2n](that[R5l.z2c][y8R],that[R5l.z2c][x5S][N2n]()+e5c);that[w5n]();that[y5S]();that[o6R][Y5S][h2R]();}else if(parent[m5S](classPrefix+A2n)){var c5S=v4c;c5S+=e2n;c5S+=D1c;var E5S=R5l.w2c;E5S+=c0R;E5S+=X4k;var f5S=Z9c;f5S+=B2n;f5S+=R5l.D2c;f5S+=R5l.z2c;var D5S=i2n;D5S+=R5l.Y2c;D5S+=t2n;D5S+=a8c;var Z5S=R5l.z2c;Z5S+=I1z;Z5S+=G2c;var V5S=r4c;V5S+=H2c;V5S+=R5l.x2c;select=parent[r5R]()[V5S](Z5S)[A5c];select[K2n]=select[D5S]!==select[f5S][E5S]-e5c?select[K2n]+e5c:A5c;$(select)[c5S]();}else if(parent[h5S](classPrefix+C2n)){var A5S=R5l.w2c;A5S+=c0R;A5S+=X4k;var N5S=z2n;N5S+=G2c;select=parent[r5R]()[c8k](N5S)[A5c];select[K2n]=select[K2n]===A5c?select[C2z][A5S]-e5c:select[K2n]-e5c;$(select)[r2n]();}else{var z5S=m9c;z5S+=U2n;z5S+=R5l.z2c;var C5S=I3R;C5S+=G2c;C5S+=R5l.R2c;var K5S=R5l.e2c;K5S+=R5l.Y2c;K5S+=R5l.R2c;K5S+=D8c;var t5S=R5l.x2c;t5S+=R5l.R2c;t5S+=j3R;var i5S=R5l.z2c;i5S+=d2n;i5S+=D8c;var B5S=T4c;B5S+=p2n;B5S+=R5l.Y2c;if(!that[R5l.z2c][R5l.x2c]){var e5S=k9c;e5S+=R5l.x2c;e5S+=w2n;e5S+=s2n;that[R5l.z2c][R5l.x2c]=that[e5S](new Date());}that[R5l.z2c][R5l.x2c][B5S](e5c);that[R5l.z2c][R5l.x2c][i5S](button[t5S](K5S));that[R5l.z2c][R5l.x2c][E2n](button[g6R](S2n));that[R5l.z2c][R5l.x2c][Q2n](button[C5S](v2n));that[T6n](K0R);if(!that[R5l.z2c][z5S][y5n]){setTimeout(function(){var O2n="ide";var r5S=k9c;r5S+=f8c;r5S+=O2n;that[r5S]();},z5c);}else{that[c6n]();}onChange();}}else{var U5S=m6n;U5S+=G2c;that[o6R][U5S][h2R]();}});},_compareDates:function(a,b){var I2n="_dateToUtcString";var j2n="cString";var T2n="_dateToUt";var d5S=T2n;d5S+=j2n;return this[I2n](a)===this[d5S](b);},_correctMonth:function(date,month){var n2n="getUTCDate";var q2n="_daysInMonth";var p5S=O5n;p5S+=T5n;p5S+=P2n;var days=this[q2n](date[a2n](),month);var correctDays=date[n2n]()>days;date[p5S](month);if(correctDays){date[Q2n](days);date[E2n](month);}},_daysInMonth:function(year,month){var P5c=31;var I5c=30;var j5c=29;var T5c=28;var isLeap=year%t5c===A5c&&(year%u5c!==A5c||year%H5c===A5c);var months=[P5c,isLeap?j5c:T5c,P5c,I5c,P5c,I5c,P5c,P5c,I5c,P5c,I5c,P5c];return months[month];},_dateToUtc:function(s){var J2n="getHours";var H2n="llYea";var X2n="etFu";var u2n="tMon";var o2n="tMinut";var Q5S=D1c;Q5S+=o2n;Q5S+=R5l.Y2c;Q5S+=R5l.z2c;var S5S=o5R;S5S+=D4c;S5S+=G2n;var s5S=D1c;s5S+=u2n;s5S+=G2c;s5S+=f8c;var w5S=o5R;w5S+=X2n;w5S+=H2n;w5S+=D8c;return new Date(Date[O6n](s[w5S](),s[s5S](),s[S5S](),s[J2n](),s[Q5S](),s[M2n]()));},_dateToUtcString:function(d){var l2n="UTCMont";var j5S=o5R;j5S+=k2n;j5S+=x9c;j5S+=O4c;var T5S=x7c;T5S+=R5l.R2c;T5S+=R5l.x2c;var O5S=D1c;O5S+=G2c;O5S+=l2n;O5S+=f8c;var v5S=k9c;v5S+=m9c;v5S+=s4k;return d[a2n]()+m7k+this[v5S](d[O5S]()+e5c)+m7k+this[T5S](d[j5S]());},_hide:function(){var L9n="keydow";var W9n="scroll";var F9n="ck.";var G5S=q4c;G5S+=f9c;G5S+=F9n;var o5S=r7R;o5S+=F8c;var n5S=W9n;n5S+=L4c;var a5S=x4R;a5S+=y4R;var q5S=L9n;q5S+=b9n;var P5S=Z9c;P5S+=R5l.m2c;P5S+=R5l.m2c;var I5S=l4R;I5S+=F1R;var namespace=this[R5l.z2c][R9n];this[o6R][T5R][I5S]();$(window)[P5S](N8k+namespace);$(document)[C8k](q5S+namespace);$(a5S)[C8k](n5S+namespace);$(o5S)[C8k](G5S+namespace);},_hours24To12:function(val){return val===A5c?U5c:val>U5c?val-U5c:val;},_htmlDay:function(day){var K9n='" data-month="';var i9n="day";var B9n='<td data-day="';var A9n='<td class="empty"></td>';var N9n="sPre";var h9n="isab";var c9n="ss=";var E9n="ton cla";var f9n="<but";var D9n="ton ";var Z9n="=\"button\" ";var V9n="day\" t";var m9n="-year=";var Y9n="day=\"";var x9n="/butt";var g9n="</td";var V2S=g9n;V2S+=u0R;var m2S=k0R;m2S+=x9n;m2S+=W5R;m2S+=u0R;var Y2S=G0R;Y2S+=u0R;var y2S=y9n;y2S+=g6R;y2S+=k0n;y2S+=Y9n;var x2S=J2c;x2S+=R5l.R2c;x2S+=m9n;x2S+=G0R;var g2S=k0n;g2S+=V9n;g2S+=g4c;g2S+=Z9n;var R2S=k0n;R2S+=R5l.p2c;R2S+=L5k;R2S+=D9n;var b2S=f9n;b2S+=E9n;b2S+=c9n;b2S+=G0R;var L2S=A0R;L2S+=y7k;L2S+=H2c;var W2S=G0R;W2S+=b3R;var M5S=G2c;M5S+=Z9c;M5S+=I3R;M5S+=R5l.e2c;var H5S=R5l.x2c;H5S+=h9n;H5S+=L9c;H5S+=g8c;var X5S=T9R;X5S+=N9n;X5S+=L5n;var u5S=R5l.x2c;u5S+=R5l.R2c;u5S+=R5l.e2c;if(day[O5k]){return A9n;}var classes=[u5S];var classPrefix=this[v4c][X5S];if(day[H5S]){var J5S=b0R;J5S+=R5l.z2c;J5S+=f8c;classes[J5S](Y2n);}if(day[M5S]){var l5S=K7c;l5S+=I3R;l5S+=R5l.e2c;var k5S=m9c;k5S+=A7c;k5S+=f8c;classes[k5S](l5S);}if(day[e9n]){var F2S=l1z;F2S+=g8c;classes[E0R](F2S);}return B9n+day[i9n]+W2S+classes[L2S](E6R)+U6R+b2S+classPrefix+R2S+classPrefix+g2S+x2S+day[t9n]+K9n+day[z5n]+y2S+day[i9n]+Y2S+day[i9n]+m2S+V2S;},_htmlMonth:function(year,month){var E8n='</table>';var f8n='<tbody>';var D8n='</thead>';var Z8n='-iconRight';var V8n="titl";var m8n="conLef";var Y8n="-i";var y8n="blo";var x8n="mb";var g8n="ekNu";var R8n=" we";var b8n='-table';var L8n='</tr>';var W8n='<tr>';var F8n="_htmlWeekOfYear";var l9n="if";var k9n="nsh";var M9n="ekNumber";var J9n="showWe";var H9n="getUTCDay";var X9n="mpareDa";var u9n="Dates";var G9n="are";var o9n="Days";var a9n="inA";var q9n="mlDay";var P9n="setUTCMinutes";var I9n="setSeconds";var j9n="setUTCHours";var T9n="CMinute";var O9n="tUT";var Q9n="eTo";var S9n="ys";var s9n="Day";var w9n="stDa";var p9n="showWeekNumb";var d9n="e class=\"";var U9n="thead>";var r9n="Head";var z9n="tmlM";var C9n="tbody>";var o5c=59;var S5c=23;var k2S=C3n;k2S+=C9n;var M2S=A0R;M2S+=Z9c;M2S+=g0R;var J2S=o7R;J2S+=z9n;J2S+=p5n;J2S+=r9n;var H2S=k0R;H2S+=U9n;var X2S=G0R;X2S+=u0R;var u2S=k0R;u2S+=m0z;u2S+=L9c;u2S+=d9n;var U2S=p9n;U2S+=R5l.A2c;var c2S=R5l.g2c;c2S+=g0R;c2S+=G2n;var E2S=r4c;E2S+=D8c;E2S+=w9n;E2S+=R5l.e2c;var f2S=o5R;f2S+=k2n;f2S+=s9n;var D2S=b8k;D2S+=S9n;D2S+=w2z;D2S+=P2n;var Z2S=T8R;Z2S+=t7R;Z2S+=Q9n;Z2S+=s2n;var now=this[Z2S](new Date()),days=this[D2S](year,month),before=new Date(Date[O6n](year,month,e5c))[f2S](),data=[],row=[];if(this[v4c][E2S]>A5c){before-=this[v4c][v9n];if(before<A5c){before+=K5c;}}var cells=days+before,after=cells;while(after>K5c){after-=K5c;}cells+=K5c-after;var minDate=this[v4c][c2S];var maxDate=this[v4c][E6n];if(minDate){var h2S=T4c;h2S+=O9n;h2S+=T9n;h2S+=R5l.z2c;minDate[j9n](A5c);minDate[h2S](A5c);minDate[I9n](A5c);}if(maxDate){maxDate[j9n](S5c);maxDate[P9n](o5c);maxDate[I9n](o5c);}for(var i=A5c,r=A5c;i<cells;i++){var K2S=k9c;K2S+=f8c;K2S+=G2c;K2S+=q9n;var t2S=u2k;t2S+=z5z;var i2S=a9n;i2S+=D8c;i2S+=n9n;var B2S=P8k;B2S+=q8k;var e2S=e2R;e2S+=v0R;e2S+=R5l.w2c;e2S+=o9n;var A2S=o7c;A2S+=j3z;A2S+=G9n;A2S+=u9n;var N2S=U5n;N2S+=X9n;N2S+=Y8c;N2S+=R5l.z2c;var day=new Date(Date[O6n](year,month,e5c+(i-before))),selected=this[R5l.z2c][R5l.x2c]?this[N2S](day,this[R5l.z2c][R5l.x2c]):t0R,today=this[A2S](day,now),empty=i<before||i>=days+before,disabled=minDate&&day<minDate||maxDate&&day>maxDate;var disableDays=this[v4c][e2S];if($[B2S](disableDays)&&$[i2S](day[H9n](),disableDays)!==-e5c){disabled=K0R;}else if(typeof disableDays===t2S&&disableDays(day)===K0R){disabled=K0R;}var dayConfig={day:e5c+(i-before),month:month,year:year,selected:selected,today:today,disabled:disabled,empty:empty};row[E0R](this[K2S](dayConfig));if(++r===K5c){var r2S=m9c;r2S+=E8c;r2S+=R5l.z2c;r2S+=f8c;var C2S=J9n;C2S+=M9n;if(this[v4c][C2S]){var z2S=E8c;z2S+=k9n;z2S+=l9n;z2S+=G2c;row[z2S](this[F8n](i-before,month,year));}data[r2S](W8n+row[V7k](Q1c)+L8n);row=[];r=A5c;}}var classPrefix=this[v4c][e3n];var className=classPrefix+b8n;if(this[v4c][U2S]){var d2S=R8n;d2S+=g8n;d2S+=x8n;d2S+=R5l.A2c;className+=d2S;}if(minDate){var j2S=y8n;j2S+=Y1c;var T2S=H2c;T2S+=Z9c;T2S+=H2c;T2S+=R5l.Y2c;var O2S=M1R;O2S+=d2z;var v2S=v4c;v2S+=R5l.z2c;v2S+=R5l.z2c;var Q2S=Y8n;Q2S+=m8n;Q2S+=G2c;var S2S=u6R;S2S+=Q3R;S2S+=L4c;var s2S=R5l.m2c;s2S+=g0R;s2S+=R5l.x2c;var w2S=V8n;w2S+=R5l.Y2c;var p2S=R5l.x2c;p2S+=Z9c;p2S+=R5l.g2c;var underMin=minDate>new Date(Date[O6n](year,month-e5c,e5c,A5c,A5c,A5c));this[p2S][w2S][s2S](S2S+classPrefix+Q2S)[v2S](O2S,underMin?T2S:j2S);}if(maxDate){var G2S=y8n;G2S+=v4c;G2S+=e9R;var o2S=v9R;o2S+=e4c;var n2S=v4c;n2S+=R5l.z2c;n2S+=R5l.z2c;var a2S=r4c;a2S+=m8c;var q2S=G2c;q2S+=f9c;q2S+=G2c;q2S+=R5l.w2c;var P2S=R5l.x2c;P2S+=Z9c;P2S+=R5l.g2c;var I2S=D2n;I2S+=j2c;var overMax=maxDate<new Date(Date[I2S](year,month+e5c,e5c,A5c,A5c,A5c));this[P2S][q2S][a2S](h8k+classPrefix+Z8n)[n2S](w5R,overMax?o2S:G2S);}return u2S+className+X2S+H2S+this[J2S]()+D8n+f8n+data[M2S](Q1c)+k2S+E8n;},_htmlMonthHead:function(){var e8n="h>";var A8n="<t";var N8n='<th></th>';var h8n="showWeekNumber";var W9S=A0R;W9S+=Z9c;W9S+=g0R;var a=[];var firstDay=this[v4c][v9n];var i18n=this[v4c][u3R];var dayName=function(day){var c8n="weekdays";day+=firstDay;while(day>=K5c){day-=K5c;}return i18n[c8n][day];};if(this[v4c][h8n]){a[E0R](N8n);}for(var i=A5c;i<K5c;i++){var F9S=C3n;F9S+=X4k;F9S+=u0R;var l2S=A8n;l2S+=e8n;a[E0R](l2S+dayName(i)+F9S);}return a[W9S](Q1c);},_htmlWeekOfYear:function(d,m,y){var C8n='-week">';var K8n='<td class="';var i8n="tDate";var B8n="d>";var W2c=86400000;var x9S=k0R;x9S+=l0R;x9S+=G2c;x9S+=B8n;var g9S=v4c;g9S+=R5l.Y2c;g9S+=f9c;g9S+=L9c;var R9S=s9k;R9S+=x9c;R9S+=R5l.R2c;R9S+=R5l.e2c;var b9S=D1c;b9S+=i8n;var L9S=T4c;L9S+=t8n;L9S+=R5l.R2c;L9S+=Y8c;var date=new Date(y,m,d,A5c,A5c,A5c,A5c);date[L9S](date[b9S]()+t5c-(date[R9S]()||K5c));var oneJan=new Date(y,A5c,e5c);var weekNum=Math[g9S](((date-oneJan)/W2c+e5c)/K5c);return K8n+this[v4c][e3n]+C8n+weekNum+x9S;},_options:function(selector,values,labels){var m9S=R5l.w2c;m9S+=H2c;m9S+=Q4z;m9S+=f8c;var Y9S=r4c;Y9S+=m8c;var y9S=R5l.x2c;y9S+=Z9c;y9S+=R5l.g2c;if(!labels){labels=values;}var select=this[y9S][T5R][Y9S](z8n+this[v4c][e3n]+m7k+selector);select[O5k]();for(var i=A5c,ien=values[m9S];i<ien;i++){var Z9S=G0R;Z9S+=u0R;var V9S=r8n;V9S+=U8n;select[p8R](V9S+values[i]+Z9S+labels[i]+d8n);}},_optionSet:function(selector,val){var s8n="ren";var w8n="option:";var p8n="nown";var B9S=l7R;B9S+=e9R;B9S+=p8n;var e9S=f9c;e9S+=V1c;e9S+=s0z;var A9S=L9c;A9S+=j6R;A9S+=o5R;A9S+=X4k;var N9S=w8n;N9S+=e9n;var h9S=Q3R;h9S+=R5l.R2c;h9S+=L9c;var c9S=F2k;c9S+=R5l.R2c;c9S+=H2c;var E9S=m9c;E9S+=R5l.R2c;E9S+=s8n;E9S+=G2c;var f9S=T9R;f9S+=R5l.z2c;f9S+=W5n;f9S+=L5n;var D9S=R5l.x2c;D9S+=Z9c;D9S+=R5l.g2c;var select=this[D9S][T5R][c8k](z8n+this[v4c][f9S]+m7k+selector);var span=select[E9S]()[H4R](c9S);select[h9S](val);var selected=select[c8k](N9S);span[s2R](selected[A9S]!==A5c?selected[W8R]():this[v4c][e9S][B9S]);},_optionsTime:function(select,count,inc){var Q8n="classPref";var S8n="hoursAvaila";var K9S=S8n;K9S+=R5l.p2c;K9S+=R5l.w2c;var t9S=R5l.m2c;t9S+=g0R;t9S+=R5l.x2c;var i9S=Q8n;i9S+=v8n;var classPrefix=this[v4c][i9S];var sel=this[o6R][T5R][t9S](z8n+classPrefix+m7k+select);var start=A5c,end=count;var allowed=this[v4c][K9S];var render=count===U5c?function(i){return i;}:this[O8n];if(count===U5c){start=e5c;end=d5c;}for(var i=start;i<end;i+=inc){if(!allowed||$[o2R](i,allowed)!==-e5c){var C9S=r8n;C9S+=U8n;sel[p8R](C9S+i+U6R+render(i)+d8n);}}},_optionsTitle:function(year,month){var H8n="months";var X8n="getFullYear";var u8n="minDate";var G8n="Pref";var o8n="axD";var n8n="etFul";var a8n="nge";var q8n="Ra";var P8n="Year";var I8n="getFull";var j8n="Range";var T8n="option";var v9S=G8R;v9S+=V7R;v9S+=o5R;v9S+=R5l.Y2c;var Q9S=R5l.e2c;Q9S+=R5l.Y2c;Q9S+=R5l.R2c;Q9S+=D8c;var S9S=k9c;S9S+=T8n;S9S+=R5l.z2c;var s9S=G8R;s9S+=V7R;s9S+=D1c;var w9S=R5l.e2c;w9S+=R5l.Y2c;w9S+=z8c;w9S+=j8n;var p9S=I8n;p9S+=P8n;var d9S=t9n;d9S+=q8n;d9S+=a8n;var U9S=o5R;U9S+=n8n;U9S+=L9c;U9S+=P8n;var r9S=R5l.g2c;r9S+=o8n;r9S+=t7R;r9S+=R5l.Y2c;var z9S=F5n;z9S+=G8n;z9S+=v8n;var classPrefix=this[v4c][z9S];var i18n=this[v4c][u3R];var min=this[v4c][u8n];var max=this[v4c][r9S];var minYear=min?min[U9S]():O6R;var maxYear=max?max[X8n]():O6R;var i=minYear!==O6R?minYear:new Date()[X8n]()-this[v4c][d9S];var j=maxYear!==O6R?maxYear:new Date()[p9S]()+this[v4c][w9S];this[c5n](S2n,this[s9S](A5c,r5c),i18n[H8n]);this[S9S](Q9S,this[v9S](i,j));},_pad:function(i){var J8n='0';return i<z5c?J8n+i:i;},_position:function(){var b7n='top';var L7n="outerHeight";var W7n="eig";var F7n="erH";var l8n="dTo";var k8n="terWidt";var M8n="scrollT";var u9S=f8c;u9S+=G7R;u9S+=o5R;u9S+=d2R;var G9S=K7c;G9S+=m9c;var o9S=M8n;o9S+=Z5R;var n9S=A9k;n9S+=k8n;n9S+=f8c;var a9S=G4R;a9S+=l8n;var q9S=L9c;q9S+=R5l.Y2c;q9S+=R5l.m2c;q9S+=G2c;var P9S=K7c;P9S+=m9c;var I9S=v4c;I9S+=R5l.z2c;I9S+=R5l.z2c;var j9S=Y4R;j9S+=F7n;j9S+=W7n;j9S+=d2R;var T9S=f9c;T9S+=N5n;T9S+=L5k;var O9S=R5l.x2c;O9S+=I0R;var offset=this[O9S][O0R][z5k]();var container=this[o6R][T5R];var inputHeight=this[o6R][T9S][j9S]();container[I9S]({top:offset[P9S]+inputHeight,left:offset[q9S]})[a9S](p5R);var calHeight=container[L7n]();var calWidth=container[n9S]();var scrollTop=$(window)[o9S]();if(offset[G9S]+inputHeight+calHeight-scrollTop>$(window)[u9S]()){var H9S=v4c;H9S+=e7R;var X9S=G2c;X9S+=Z9c;X9S+=m9c;var newTop=offset[X9S]-calHeight;container[H9S](b7n,newTop<A5c?A5c:newTop);}if(calWidth+offset[r5k]>$(window)[D0k]()){var M9S=C5k;M9S+=G2c;var J9S=v4c;J9S+=R5l.z2c;J9S+=R5l.z2c;var newLeft=$(window)[D0k]()-calWidth;container[J9S](M9S,newLeft<A5c?A5c:newLeft);}},_range:function(start,end){var a=[];for(var i=start;i<=end;i++){a[E0R](i);}return a;},_setCalander:function(){var y7n="enda";var x7n="_html";var g7n="ispla";var R7n="UTCMonth";var k9S=e2R;k9S+=z2R;if(this[R5l.z2c][k9S]){var L8S=s9k;L8S+=R7n;var W8S=R5l.x2c;W8S+=g7n;W8S+=R5l.e2c;var F8S=x7n;F8S+=c8c;F8S+=p5n;var l9S=k9R;l9S+=L9c;l9S+=y7n;l9S+=D8c;this[o6R][l9S][O5k]()[p8R](this[F8S](this[R5l.z2c][y8R][a2n](),this[R5l.z2c][W8S][L8S]()));}},_setTitle:function(){var f7n="ionS";var D7n="_op";var Z7n="TCM";var V7n="getU";var m7n="lYear";var Y7n="getUTCF";var Y8S=Y7n;Y8S+=E8c;Y8S+=L9c;Y8S+=m7n;var y8S=u6R;y8S+=R5l.z2c;y8S+=B2R;y8S+=R5l.e2c;var x8S=R5l.e2c;x8S+=R5l.Y2c;x8S+=R5l.R2c;x8S+=D8c;var g8S=V7n;g8S+=Z7n;g8S+=p5n;var R8S=R5l.x2c;R8S+=Z1R;R8S+=D1R;var b8S=D7n;b8S+=G2c;b8S+=f7n;b8S+=D4c;this[b8S](S2n,this[R5l.z2c][R8S][g8S]());this[E7n](x8S,this[R5l.z2c][y8S][Y8S]());},_setTime:function(){var U7n="getUTCMinutes";var r7n='hours';var z7n="24To12";var C7n="_hours";var K7n="tionSet";var t7n="CHou";var e7n="hours1";var A7n="nSet";var N7n="_optio";var h7n="tes";var c7n="nds";var N8S=R5l.z2c;N8S+=R5l.Y2c;N8S+=i5R;N8S+=c7n;var h8S=G6n;h8S+=E8c;h8S+=h7n;var c8S=N7n;c8S+=A7n;var Z8S=e7n;Z8S+=B7n;var V8S=M6n;V8S+=G2c;V8S+=R5l.z2c;var m8S=i7n;m8S+=t7n;m8S+=c1k;var d=this[R5l.z2c][R5l.x2c];var hours=d?d[m8S]():A5c;if(this[R5l.z2c][V8S][Z8S]){var E8S=k9c;E8S+=Z9c;E8S+=m9c;E8S+=K7n;var f8S=C7n;f8S+=z7n;var D8S=f8c;D8S+=A9k;D8S+=c1k;this[E7n](D8S,this[f8S](hours));this[E8S](l3n,hours<U5c?h5n:A7z);}else{this[E7n](r7n,hours);}this[c8S](h8S,d?d[U7n]():A5c);this[E7n](N8S,d?d[M2n]():A5c);},_show:function(){var O7n='div.DTE_Body_Content';var S7n="oll.";var s7n="esiz";var w7n=" r";var p7n="roll.";var d7n="eydow";var K8S=e9R;K8S+=d7n;K8S+=b9n;var t8S=j4R;t8S+=p7n;var B8S=w7n;B8S+=s7n;B8S+=R5l.Y2c;B8S+=L4c;var e8S=R5l.z2c;e8S+=v4c;e8S+=D8c;e8S+=S7n;var A8S=t5n;A8S+=R5l.D2c;var that=this;var namespace=this[R5l.z2c][R9n];this[A8S]();$(window)[W5R](e8S+namespace+B8S+namespace,function(){var v7n="siti";var Q7n="_po";var i8S=Q7n;i8S+=v7n;i8S+=W5R;that[i8S]();});$(O7n)[W5R](t8S+namespace,function(){var T7n="_position";that[T7n]();});$(document)[W5R](K8S+namespace,function(e){var C5c=9;if(e[u5k]===C5c||e[u5k]===O5c||e[u5k]===d5c){var C8S=k9c;C8S+=f8c;C8S+=W6R;C8S+=R5l.Y2c;that[C8S]();}});setTimeout(function(){var j7n='click.';var z8S=v1k;z8S+=R5l.e2c;$(z8S)[W5R](j7n+namespace,function(e){var I7n="arg";var U8S=v2R;U8S+=R5l.g2c;var r8S=G2c;r8S+=I7n;r8S+=D4c;var parents=$(e[a7R])[f2z]();if(!parents[I4z](that[o6R][T5R])[i0R]&&e[r8S]!==that[U8S][O0R][A5c]){var d8S=o7R;d8S+=W6R;d8S+=R5l.Y2c;that[d8S]();}});},z5c);},_writeOutput:function(focus){var n7n="ntLocale";var a7n="ntStrict";var q7n="ullYear";var P7n="CDat";var O8S=f9c;O8S+=n6n;O8S+=G2c;var v8S=R5l.x2c;v8S+=Z9c;v8S+=R5l.g2c;var Q8S=s9k;Q8S+=D2n;Q8S+=P7n;Q8S+=R5l.Y2c;var S8S=k9c;S8S+=m9c;S8S+=R5l.R2c;S8S+=R5l.x2c;var s8S=i7n;s8S+=j2c;s8S+=Z8c;s8S+=q7n;var w8S=p6n;w8S+=a7n;var p8S=H4c;p8S+=R5l.g2c;p8S+=R5l.Y2c;p8S+=n7n;var date=this[R5l.z2c][R5l.x2c];var out=window[B3n]?window[B3n][S6n](date,undefined,this[v4c][p8S],this[v4c][w8S])[i3n](this[v4c][i3n]):date[s8S]()+m7k+this[O8n](date[N2n]()+e5c)+m7k+this[S8S](date[Q8S]());this[v8S][O8S][a2R](out);if(focus){var j8S=m6n;j8S+=G2c;var T8S=R5l.x2c;T8S+=Z9c;T8S+=R5l.g2c;this[T8S][j8S][h2R]();}}});Editor[I8S][P8S]=A5c;Editor[T0n][q8S]={classPrefix:a8S,disableDays:O6R,firstDay:e5c,format:t3n,hoursAvailable:O6R,i18n:Editor[L7z][u3R][n8S],maxDate:O6R,minDate:O6R,minutesIncrement:e5c,momentStrict:K0R,momentLocale:o8S,onChange:function(){},secondsIncrement:e5c,showWeekNumber:t0R,yearRange:z5c};(function(){var A6l='upload.editor';var D6l="<s";var o3l="_picker";var P3l="datetime";var S3l="cker";var U3l="icke";var r3l="datep";var z3l="ker";var N3l="icker";var f3l="datepicker";var n0l="radio";var S0l="_addOptions";var s0l="_inp";var w0l="checked";var K0l="r_val";var t0l='input:checked';var E0l='<label for="';var f0l='_';var D0l='<input id="';var y0l="lu";var x0l="optionsPair";var b0l="checkbox";var X1n="separator";var I1n="_lastSet";var T1n='change.dte';var O1n="multiple";var Q1n="_inpu";var S1n="eId";var s1n="saf";var z1n="_editor_val";var D1n="afe";var m1n='text';var R1n="readonly";var b1n="_val";var L1n="prop";var W1n="inp";var F1n="abled";var X4n='div.rendered';var i4n="_enabled";var B4n="_input";var J7n="fieldTyp";var H7n="passwo";var X7n="extare";var u7n="xtend";var G7n="loadMany";var o7n="ten";var Q6c=R5l.Y2c;Q6c+=a8c;Q6c+=o7n;Q6c+=R5l.x2c;var S6c=T2k;S6c+=G7n;var R6c=Q3z;R6c+=j6R;R6c+=R5l.x2c;var U3c=n1z;U3c+=m8c;var I0c=R5l.x2c;I0c+=R5l.R2c;I0c+=G2c;I0c+=R5l.Y2c;var G1S=R5l.Y2c;G1S+=u7n;var o1S=D8c;o1S+=R5l.R2c;o1S+=R5l.x2c;o1S+=T4k;var N4S=Q3z;N4S+=j6R;N4S+=R5l.x2c;var h4S=i2n;h4S+=R5l.Y2c;h4S+=e0R;var V4S=G2c;V4S+=X7n;V4S+=R5l.R2c;var g4S=o2c;g4S+=Y8c;g4S+=H2c;g4S+=R5l.x2c;var R4S=H7n;R4S+=V2k;var k7S=R5l.Y2c;k7S+=u7n;var M7S=Y8c;M7S+=p2k;var G7S=R5l.Y2c;G7S+=u7n;var n7S=Q9k;n7S+=B3k;n7S+=j6R;var G8S=J7n;G8S+=H7c;var fieldTypes=Editor[G8S];function _buttonText(conf,text){var l7n='div.upload button';var k7n="Choose file...";var M7n="uploadTe";var X8S=B8R;X8S+=n6n;X8S+=G2c;if(text===O6R||text===undefined){var u8S=M7n;u8S+=a8c;u8S+=G2c;text=conf[u8S]||k7n;}conf[X8S][c8k](l7n)[s2R](text);}function _commonUpload(editor,conf,dropCallback){var M4n='input[type=file]';var H4n='div.clearValue button';var u4n="dClass";var G4n="pp";var I4n='over';var s4n='div.drop';var w4n="dragDropText";var p4n='div.drop span';var d4n="rop a file here to uplo";var U4n="and d";var r4n="Drag ";var z4n="ave dragexit";var C4n="agl";var K4n="dragov";var t4n="FileReader";var e4n='<div class="cell">';var A4n='<div class="cell clearValue">';var N4n='<button class="';var h4n='<div class="cell upload">';var c4n='<div class="row">';var E4n='<div class="editor_upload">';var f4n="u_table\">";var D4n="class=\"e";var Z4n="iv ";var V4n="<d";var m4n="<input type=\"file\"";var Y4n="ton class=\"";var y4n="d\">";var x4n="class=\"row secon";var g4n="<div ";var R4n=" class=\"drop\"><span/></div>";var b4n="\"/>";var L4n="red";var W4n="<div class=\"rende";var F4n="ragDrop";var v7S=Z9c;v7S+=H2c;var w7S=Z9c;w7S+=H2c;var p7S=H2k;p7S+=R5l.x2c;var y7S=R5l.x2c;y7S+=F4n;var x7S=n0R;x7S+=o0R;var g7S=W4n;g7S+=L4n;g7S+=b4n;var R7S=k0R;R7S+=D3n;var b7S=A6k;b7S+=R4n;var L7S=g4n;L7S+=x4n;L7S+=y4n;var W7S=y9n;W7S+=h6k;var F7S=Y3n;F7S+=L5k;F7S+=Y4n;var l8S=k0R;l8S+=D3n;var k8S=m4n;k8S+=h6k;var M8S=V4n;M8S+=Z4n;M8S+=D4n;M8S+=f4n;var J8S=R5l.p2c;J8S+=n7k;J8S+=H2c;var H8S=v4c;H8S+=y2n;H8S+=T4c;H8S+=R5l.z2c;var btnClass=editor[H8S][n5k][J8S];var container=$(E4n+M8S+c4n+h4n+N4n+btnClass+o6k+k8S+l8S+A4n+F7S+btnClass+W7S+i6R+i6R+L7S+e4n+b7S+R7S+e4n+g7S+i6R+x7S+i6R+i6R);conf[B4n]=container;conf[i4n]=K0R;_buttonText(conf);if(window[t4n]&&conf[y7S]!==t0R){var t7S=Z9c;t7S+=H2c;var A7S=K4n;A7S+=R5l.A2c;var c7S=h4z;c7S+=C4n;c7S+=R5l.Y2c;c7S+=z4n;var V7S=R5l.x2c;V7S+=t7c;V7S+=m9c;var m7S=Z9c;m7S+=H2c;var Y7S=r4n;Y7S+=U4n;Y7S+=d4n;Y7S+=s4k;container[c8k](p4n)[W8R](conf[w4n]||Y7S);var dragDrop=container[c8k](s4n);dragDrop[m7S](V7S,function(e){var O4n="originalEvent";var v4n="upl";var Q4n="nsfer";var S4n="ataT";var Z7S=k9c;Z7S+=j6R;Z7S+=D3k;Z7S+=g8c;if(conf[Z7S]){var E7S=Z9c;E7S+=Q3R;E7S+=R5l.Y2c;E7S+=D8c;var f7S=R5l.x2c;f7S+=S4n;f7S+=B1R;f7S+=Q4n;var D7S=v4n;D7S+=Z9c;D7S+=R5l.R2c;D7S+=R5l.x2c;Editor[D7S](editor,conf,e[O4n][f7S][V0R],_buttonText,dropCallback);dragDrop[M5R](E7S);}return t0R;})[W5R](c7S,function(e){var j4n="removeCla";var T4n="nab";var h7S=C7c;h7S+=T4n;h7S+=R5l.w2c;h7S+=R5l.x2c;if(conf[h7S]){var N7S=j4n;N7S+=R5l.z2c;N7S+=R5l.z2c;dragDrop[N7S](I4n);}return t0R;})[W5R](A7S,function(e){var q4n="dC";var P4n="enabled";var e7S=k9c;e7S+=P4n;if(conf[e7S]){var B7S=R5l.R2c;B7S+=R5l.x2c;B7S+=q4n;B7S+=O5R;dragDrop[B7S](I4n);}return t0R;});editor[W5R](k2z,function(){var a4n='dragover.DTE_Upload drop.DTE_Upload';var i7S=Z9c;i7S+=H2c;$(p5R)[i7S](a4n,function(e){return t0R;});})[t7S](J3k,function(){var o4n="ad drop.DTE_Upload";var n4n="dragover.DTE_Uplo";var z7S=n4n;z7S+=o4n;var C7S=Z9c;C7S+=R5l.m2c;C7S+=R5l.m2c;var K7S=R5l.p2c;K7S+=Z9c;K7S+=F8c;$(K7S)[C7S](z7S);});}else{var d7S=R5l.R2c;d7S+=G4n;d7S+=R5l.Y2c;d7S+=m8c;var U7S=v9R;U7S+=x9c;U7S+=t7c;U7S+=m9c;var r7S=s4k;r7S+=u4n;container[r7S](U7S);container[d7S](container[c8k](X4n));}container[p7S](H4n)[w7S](L5R,function(){var Q7S=v4c;Q7S+=R5l.R2c;Q7S+=L9c;Q7S+=L9c;var S7S=T4c;S7S+=G2c;var s7S=E8c;s7S+=B9R;s7S+=Z9c;s7S+=s4k;Editor[J4n][s7S][S7S][Q7S](editor,conf,Q1c);});container[c8k](M4n)[v7S](i5n,function(){var O7S=T2k;O7S+=m1k;Editor[O7S](editor,conf,this[V0R],_buttonText,function(ids){var T7S=Q3R;T7S+=R5l.R2c;T7S+=L9c;dropCallback[Y5R](editor,ids);container[c8k](M4n)[T7S](Q1c);});});return container;}function _triggerChange(input){setTimeout(function(){var l4n="trigger";var k4n="chang";var j7S=k4n;j7S+=R5l.Y2c;input[l4n](j7S,{editor:K0R,editorSet:K0R});},A5c);}var baseFieldType=$[H3R](K0R,{},Editor[F8R][b8R],{get:function(conf){var I7S=Q3R;I7S+=R5l.R2c;I7S+=L9c;return conf[B4n][I7S]();},set:function(conf,val){conf[B4n][a2R](val);_triggerChange(conf[B4n]);},enable:function(conf){var q7S=e2R;q7S+=F1n;var P7S=m9c;P7S+=D8c;P7S+=Z9c;P7S+=m9c;conf[B4n][P7S](q7S,t0R);},disable:function(conf){var a7S=k9c;a7S+=W1n;a7S+=E8c;a7S+=G2c;conf[a7S][L1n](Y2n,K0R);},canReturnSubmit:function(conf,node){return K0R;}});fieldTypes[n7S]={create:function(conf){conf[b1n]=conf[N4k];return O6R;},get:function(conf){return conf[b1n];},set:function(conf,val){var o7S=k9c;o7S+=l6R;o7S+=L9c;conf[o7S]=val;}};fieldTypes[R1n]=$[G7S](K0R,{},baseFieldType,{create:function(conf){var g1n='<input/>';var J7S=R9c;J7S+=m9c;J7S+=L5k;var H7S=P7k;H7S+=G2c;var X7S=f9c;X7S+=R5l.x2c;var u7S=Q3z;u7S+=j6R;u7S+=R5l.x2c;conf[B4n]=$(g1n)[P4z]($[u7S]({id:Editor[e6R](conf[X7S]),type:H7S,readonly:k6R},conf[P4z]||{}));return conf[J7S][A5c];}});fieldTypes[M7S]=$[k7S](K0R,{},baseFieldType,{create:function(conf){var Y1n="t/>";var y1n="<inpu";var x1n="ttr";var b4S=k9c;b4S+=f9c;b4S+=H2c;b4S+=f2R;var L4S=t6k;L4S+=D8c;var W4S=f9c;W4S+=R5l.x2c;var F4S=R5l.R2c;F4S+=x1n;var l7S=y1n;l7S+=Y1n;conf[B4n]=$(l7S)[F4S]($[H3R]({id:Editor[e6R](conf[W4S]),type:m1n},conf[L4S]||{}));return conf[b4S][A5c];}});fieldTypes[R4S]=$[g4S](K0R,{},baseFieldType,{create:function(conf){var Z1n='password';var V1n="input/>";var m4S=f9c;m4S+=R5l.x2c;var Y4S=t7R;Y4S+=G2c;Y4S+=D8c;var y4S=k0R;y4S+=V1n;var x4S=k9c;x4S+=g0R;x4S+=b0R;x4S+=G2c;conf[x4S]=$(y4S)[Y4S]($[H3R]({id:Editor[e6R](conf[m4S]),type:Z1n},conf[P4z]||{}));return conf[B4n][A5c];}});fieldTypes[V4S]=$[H3R](K0R,{},baseFieldType,{create:function(conf){var E1n="<textare";var f1n="Id";var c4S=f9c;c4S+=R5l.x2c;var E4S=R5l.z2c;E4S+=D1n;E4S+=f1n;var f4S=R5l.R2c;f4S+=X5z;f4S+=D8c;var D4S=E1n;D4S+=R5l.R2c;D4S+=l0R;D4S+=u0R;var Z4S=R9c;Z4S+=f2R;conf[Z4S]=$(D4S)[f4S]($[H3R]({id:Editor[E4S](conf[c4S])},conf[P4z]||{}));return conf[B4n][A5c];},canReturnSubmit:function(conf,node){return t0R;}});fieldTypes[h4S]=$[N4S](K0R,{},baseFieldType,{_addOptions:function(conf,opts,append){var U1n="air";var r1n="optionsP";var C1n="placeholder";var K1n="derValue";var t1n="lacehol";var i1n="eholderVal";var B1n="eholderDisabled";var e1n="plac";var A1n="placeholderDis";var N1n="den";var h1n="lder";var c1n="placeho";var A4S=D6n;A4S+=c9k;var elOpts=conf[B4n][A5c][A4S];var countOffset=A5c;if(!append){var e4S=c1n;e4S+=h1n;elOpts[i0R]=A5c;if(conf[e4S]!==undefined){var C4S=t4c;C4S+=N1n;var K4S=A1n;K4S+=F1n;var t4S=e1n;t4S+=B1n;var i4S=B9R;i4S+=l2R;i4S+=i1n;i4S+=A2R;var B4S=m9c;B4S+=t1n;B4S+=K1n;var placeholderValue=conf[B4S]!==undefined?conf[i4S]:Q1c;countOffset+=e5c;elOpts[A5c]=new Option(conf[C1n],placeholderValue);var disabled=conf[t4S]!==undefined?conf[K4S]:K0R;elOpts[A5c][C4S]=disabled;elOpts[A5c][a5R]=disabled;elOpts[A5c][z1n]=placeholderValue;}}else{var z4S=u4k;z4S+=X4k;countOffset=elOpts[z4S];}if(opts){var U4S=r1n;U4S+=U1n;var r4S=m4k;r4S+=f9c;r4S+=D8c;r4S+=R5l.z2c;Editor[r4S](opts,conf[U4S],function(val,label,i,attr){var option=new Option(label,val);option[z1n]=val;if(attr){var d4S=R5l.R2c;d4S+=G2c;d4S+=G2c;d4S+=D8c;$(option)[d4S](attr);}elOpts[i+countOffset]=option;});}},create:function(conf){var v1n='<select/>';var w1n="addOptions";var p1n="Opts";var d1n="ip";var P4S=R9c;P4S+=b0R;P4S+=G2c;var I4S=d1n;I4S+=p1n;var j4S=k9c;j4S+=w1n;var v4S=Z9c;v4S+=H2c;var Q4S=t7R;Q4S+=G2c;Q4S+=D8c;var S4S=s1n;S4S+=S1n;var s4S=R5l.Y2c;s4S+=a8c;s4S+=G2c;s4S+=U2R;var w4S=t6k;w4S+=D8c;var p4S=Q1n;p4S+=G2c;conf[p4S]=$(v1n)[w4S]($[s4S]({id:Editor[S4S](conf[W6R]),multiple:conf[O1n]===K0R},conf[Q4S]||{}))[v4S](T1n,function(e,d){var j1n="ditor";var O4S=R5l.Y2c;O4S+=j1n;if(!d||!d[O4S]){var T4S=z2n;T4S+=G2c;conf[I1n]=fieldTypes[T4S][s9k](conf);}});fieldTypes[l1z][j4S](conf,conf[C2z]||conf[I4S]);return conf[P4S][A5c];},update:function(conf,options,append){var n1n="ele";var a1n="ptio";var q1n="ddO";var P1n="_a";var a4S=P1n;a4S+=q1n;a4S+=a1n;a4S+=c9k;var q4S=R5l.z2c;q4S+=n1n;q4S+=e0R;fieldTypes[q4S][a4S](conf,options,append);var lastSet=conf[I1n];if(lastSet!==undefined){var o4S=T4c;o4S+=G2c;var n4S=R5l.z2c;n4S+=z3R;n4S+=w6k;n4S+=G2c;fieldTypes[n4S][o4S](conf,lastSet,K0R);}_triggerChange(conf[B4n]);},get:function(conf){var u1n="rator";var G1n="toArray";var o1n='option:selected';var G4S=r4c;G4S+=H2c;G4S+=R5l.x2c;var val=conf[B4n][G4S](o1n)[D9k](function(){return this[z1n];})[G1n]();if(conf[O1n]){var X4S=T4c;X4S+=m9c;X4S+=R5l.R2c;X4S+=u1n;var u4S=A0R;u4S+=Z9c;u4S+=g0R;return conf[X1n]?val[u4S](conf[X4S]):val;}return val[i0R]?val[A5c]:O6R;},set:function(conf,val,localUpdate){var L0l="ected";var W0l='option';var F0l="pli";var l1n="separat";var k1n="isArra";var M1n="opt";var J1n="older";var H1n="placeh";var R1S=H1n;R1S+=J1n;var b1S=R5l.Y2c;b1S+=R5l.R2c;b1S+=b8c;var L1S=r4c;L1S+=m8c;var W1S=M1n;W1S+=T4k;W1S+=H2c;var F1S=R5l.w2c;F1S+=c4k;var J4S=k1n;J4S+=R5l.e2c;var H4S=R5l.g2c;H4S+=r0R;H4S+=m8z;if(!localUpdate){conf[I1n]=val;}if(conf[H4S]&&conf[X1n]&&!$[J4S](val)){var l4S=l1n;l4S+=P9c;var k4S=R5l.z2c;k4S+=F0l;k4S+=G2c;var M4S=d0n;M4S+=f9c;M4S+=H2c;M4S+=o5R;val=typeof val===M4S?val[k4S](conf[l4S]):[];}else if(!$[V9R](val)){val=[val];}var i,len=val[F1S],found,allFound=t0R;var options=conf[B4n][c8k](W1S);conf[B4n][L1S](W0l)[b1S](function(){found=t0R;for(i=A5c;i<len;i++){if(this[z1n]==val[i]){found=K0R;allFound=K0R;break;}}this[e9n]=found;});if(conf[R1S]&&!allFound&&!conf[O1n]&&options[i0R]){var g1S=i2n;g1S+=L0l;options[A5c][g1S]=K0R;}if(!localUpdate){var x1S=B8R;x1S+=N5n;x1S+=E8c;x1S+=G2c;_triggerChange(conf[x1S]);}return allFound;},destroy:function(conf){var y1S=k9c;y1S+=f9c;y1S+=N5n;y1S+=L5k;conf[y1S][C8k](T1n);}});fieldTypes[b0l]=$[H3R](K0R,{},baseFieldType,{_addOptions:function(conf,opts,append){var g0l="pai";var R0l="pty";var Y1S=R9c;Y1S+=m9c;Y1S+=L5k;var val,label;var jqInput=conf[Y1S];var offset=A5c;if(!append){var m1S=R5l.Y2c;m1S+=R5l.g2c;m1S+=R0l;jqInput[m1S]();}else{var Z1S=R5l.w2c;Z1S+=c0R;Z1S+=G2c;Z1S+=f8c;var V1S=g0R;V1S+=m9c;V1S+=L5k;offset=$(V1S,jqInput)[Z1S];}if(opts){var D1S=g0l;D1S+=D8c;D1S+=R5l.z2c;Editor[D1S](opts,conf[x0l],function(val,label,i,attr){var c0l='input:last';var Z0l="\"checkbox\" />";var V0l="\" type=";var m0l="ast";var Y0l="input:l";var B1S=Q3R;B1S+=R5l.R2c;B1S+=y0l;B1S+=R5l.Y2c;var e1S=R5l.R2c;e1S+=G2c;e1S+=G2c;e1S+=D8c;var A1S=Y0l;A1S+=m0l;var N1S=G0R;N1S+=u0R;var h1S=V0l;h1S+=Z0l;var c1S=s1n;c1S+=S1n;var E1S=s3R;E1S+=Q3R;E1S+=u0R;var f1S=C8R;f1S+=m9c;f1S+=U2R;jqInput[f1S](E1S+D0l+Editor[c1S](conf[W6R])+f0l+(i+offset)+h1S+E0l+Editor[e6R](conf[W6R])+f0l+(i+offset)+N1S+label+t6R+i6R);$(A1S,jqInput)[e1S](B1S,val)[A5c][z1n]=val;if(attr){$(c0l,jqInput)[P4z](attr);}});}},create:function(conf){var N0l="ipOpts";var h0l="addOptio";var K1S=k9c;K1S+=m6n;K1S+=G2c;var t1S=k9c;t1S+=h0l;t1S+=c9k;var i1S=s3R;i1S+=Q3R;i1S+=R0R;i1S+=h6k;conf[B4n]=$(i1S);fieldTypes[b0l][t1S](conf,conf[C2z]||conf[N0l]);return conf[K1S][A5c];},get:function(conf){var C0l="unselectedValue";var i0l="Val";var B0l="lected";var e0l="unse";var A0l="separa";var S1S=A0l;S1S+=G2c;S1S+=P9c;var s1S=A0R;s1S+=Z9c;s1S+=f9c;s1S+=H2c;var p1S=e0l;p1S+=B0l;p1S+=i0l;p1S+=A2R;var z1S=L9c;z1S+=j6R;z1S+=s2k;var C1S=R5l.m2c;C1S+=f9c;C1S+=m8c;var out=[];var selected=conf[B4n][C1S](t0l);if(selected[z1S]){var r1S=I8c;r1S+=v4c;r1S+=f8c;selected[r1S](function(){var d1S=C7c;d1S+=u6R;d1S+=K7c;d1S+=K0l;var U1S=y8z;U1S+=f8c;out[U1S](this[d1S]);});}else if(conf[p1S]!==undefined){var w1S=b0R;w1S+=Q8R;out[w1S](conf[C0l]);}return conf[X1n]===undefined||conf[X1n]===O6R?out:out[s1S](conf[S1S]);},set:function(conf,val){var d0l='|';var U0l="arat";var r0l="sep";var z0l="Ar";var j1S=u4k;j1S+=X4k;var T1S=f9c;T1S+=R5l.z2c;T1S+=z0l;T1S+=n9n;var v1S=g0R;v1S+=m9c;v1S+=E8c;v1S+=G2c;var Q1S=R5l.m2c;Q1S+=f9c;Q1S+=m8c;var jqInputs=conf[B4n][Q1S](v1S);if(!$[V9R](val)&&typeof val===W9R){var O1S=r0l;O1S+=U0l;O1S+=P9c;val=val[s3z](conf[O1S]||d0l);}else if(!$[T1S](val)){val=[val];}var i,len=val[j1S],found;jqInputs[u2R](function(){var p0l="_edito";found=t0R;for(i=A5c;i<len;i++){var I1S=p0l;I1S+=K0l;if(this[I1S]==val[i]){found=K0R;break;}}this[w0l]=found;});_triggerChange(jqInputs);},enable:function(conf){var q1S=e2R;q1S+=D3k;q1S+=R5l.Y2c;q1S+=R5l.x2c;var P1S=s0l;P1S+=L5k;conf[P1S][c8k](Y2R)[L1n](q1S,t0R);},disable:function(conf){conf[B4n][c8k](Y2R)[L1n](Y2n,K0R);},update:function(conf,options,append){var n1S=R5l.z2c;n1S+=R5l.Y2c;n1S+=G2c;var a1S=D1c;a1S+=G2c;var checkbox=fieldTypes[b0l];var currVal=checkbox[a1S](conf);checkbox[S0l](conf,options,append);checkbox[n1S](conf,currVal);}});fieldTypes[o1S]=$[G1S](K0R,{},baseFieldType,{_addOptions:function(conf,opts,append){var val,label;var jqInput=conf[B4n];var offset=A5c;if(!append){jqInput[O5k]();}else{var X1S=u4k;X1S+=G2c;X1S+=f8c;var u1S=f9c;u1S+=N5n;u1S+=E8c;u1S+=G2c;offset=$(u1S,jqInput)[X1S];}if(opts){Editor[D4k](opts,conf[x0l],function(val,label,i,attr){var P0l=":last";var I0l="eI";var j0l="af";var T0l="io\" name=\"";var O0l="type=\"ra";var v0l=" />";var Q0l=":l";var b0c=Q3R;b0c+=R5l.R2c;b0c+=y0l;b0c+=R5l.Y2c;var L0c=O0R;L0c+=Q0l;L0c+=R5l.R2c;L0c+=k1R;var W0c=G0R;W0c+=u0R;var F0c=R5l.z2c;F0c+=D1n;F0c+=s9c;F0c+=R5l.x2c;var l1S=G0R;l1S+=v0l;var k1S=y9n;k1S+=O0l;k1S+=R5l.x2c;k1S+=T0l;var M1S=R5l.z2c;M1S+=j0l;M1S+=I0l;M1S+=R5l.x2c;var J1S=k0R;J1S+=u6R;J1S+=Q3R;J1S+=u0R;var H1S=R5l.R2c;H1S+=m9c;H1S+=O4k;jqInput[H1S](J1S+D0l+Editor[M1S](conf[W6R])+f0l+(i+offset)+k1S+conf[R6R]+l1S+E0l+Editor[F0c](conf[W6R])+f0l+(i+offset)+W0c+label+t6R+i6R);$(L0c,jqInput)[P4z](b0c,val)[A5c][z1n]=val;if(attr){var g0c=R5l.R2c;g0c+=X5z;g0c+=D8c;var R0c=O0R;R0c+=P0l;$(R0c,jqInput)[g0c](attr);}});}},create:function(conf){var a0l='<div />';var q0l="_addOptio";var Z0c=Z5R;Z0c+=R5l.Y2c;Z0c+=H2c;var V0c=Z9c;V0c+=H2c;var m0c=f9c;m0c+=m9c;m0c+=f7k;m0c+=b9c;var Y0c=Z9c;Y0c+=m9c;Y0c+=f5R;Y0c+=c9k;var y0c=q0l;y0c+=H2c;y0c+=R5l.z2c;var x0c=B8R;x0c+=H2c;x0c+=m9c;x0c+=L5k;conf[x0c]=$(a0l);fieldTypes[n0l][y0c](conf,conf[Y0c]||conf[m0c]);this[V0c](Z0c,function(){var D0c=k9c;D0c+=f9c;D0c+=n6n;D0c+=G2c;conf[D0c][c8k](Y2R)[u2R](function(){var o0l="_preChecked";if(this[o0l]){this[w0l]=K0R;}});});return conf[B4n][A5c];},get:function(conf){var X0l="cked";var u0l="t:che";var G0l="ditor_";var c0c=C7c;c0c+=G0l;c0c+=Q3R;c0c+=L3k;var E0c=m6n;E0c+=u0l;E0c+=X0l;var f0c=R9c;f0c+=m9c;f0c+=L5k;var el=conf[f0c][c8k](E0c);return el[i0R]?el[A5c][c0c]:undefined;},set:function(conf,val){var z0c=k9c;z0c+=f9c;z0c+=N5n;z0c+=L5k;var e0c=R5l.Y2c;e0c+=F1R;var A0c=f9c;A0c+=H2c;A0c+=m9c;A0c+=L5k;var N0c=R5l.m2c;N0c+=f9c;N0c+=H2c;N0c+=R5l.x2c;var h0c=R9c;h0c+=f2R;var that=this;conf[h0c][N0c](A0c)[e0c](function(){var F3l="hecked";var l0l="preC";var k0l="Checked";var M0l="ecked";var J0l="eCh";var H0l="ditor_val";var i0c=k9c;i0c+=R5l.Y2c;i0c+=H0l;var B0c=x7c;B0c+=D8c;B0c+=J0l;B0c+=M0l;this[B0c]=t0R;if(this[i0c]==val){var t0c=k9c;t0c+=a2c;t0c+=R5l.Y2c;t0c+=k0l;this[w0l]=K0R;this[t0c]=K0R;}else{var C0c=k9c;C0c+=l0l;C0c+=f8c;C0c+=M0l;var K0c=v4c;K0c+=F3l;this[K0c]=t0R;this[C0c]=t0R;}});_triggerChange(conf[z0c][c8k](t0l));},enable:function(conf){var U0c=g0R;U0c+=f2R;var r0c=H2k;r0c+=R5l.x2c;conf[B4n][r0c](U0c)[L1n](Y2n,t0R);},disable:function(conf){var p0c=m9c;p0c+=D8c;p0c+=Z5R;var d0c=f9c;d0c+=H2c;d0c+=m9c;d0c+=L5k;conf[B4n][c8k](d0c)[p0c](Y2n,K0R);},update:function(conf,options,append){var R3l="lter";var b3l="e=";var L3l="alu";var W3l="[v";var j0c=l6R;j0c+=y0l;j0c+=R5l.Y2c;var T0c=R5l.R2c;T0c+=G2c;T0c+=G2c;T0c+=D8c;var O0c=G0R;O0c+=U6z;var v0c=W3l;v0c+=L3l;v0c+=b3l;v0c+=G0R;var Q0c=r4c;Q0c+=R3l;var S0c=R5l.z2c;S0c+=R5l.Y2c;S0c+=G2c;var s0c=W1n;s0c+=L5k;var w0c=o5R;w0c+=D4c;var radio=fieldTypes[n0l];var currVal=radio[w0c](conf);radio[S0l](conf,options,append);var inputs=conf[B4n][c8k](s0c);radio[S0c](conf,inputs[Q0c](v0c+currVal+O0c)[i0R]?currVal:inputs[H6k](A5c)[T0c](j0c));}});fieldTypes[I0c]=$[H3R](K0R,{},baseFieldType,{create:function(conf){var t3l='date';var i3l='type';var D3l="822";var Z3l="RFC_";var V3l="dateFormat";var m3l='jqueryui';var Y3l="Clas";var y3l='<input />';var x3l="afeId";var g3l="atepi";var x3c=k9c;x3c+=O0R;var G0c=R5l.x2c;G0c+=g3l;G0c+=Y1c;G0c+=R5l.A2c;var o0c=t7R;o0c+=G2c;o0c+=D8c;var n0c=f9c;n0c+=R5l.x2c;var a0c=R5l.z2c;a0c+=x3l;var q0c=t6k;q0c+=D8c;var P0c=B8R;P0c+=H2c;P0c+=f2R;conf[P0c]=$(y3l)[q0c]($[H3R]({id:Editor[a0c](conf[n0c]),type:m1n},conf[o0c]));if($[G0c]){var u0c=u5R;u0c+=Y3l;u0c+=R5l.z2c;conf[B4n][u0c](m3l);if(!conf[V3l]){var X0c=Z3l;X0c+=B7n;X0c+=D3l;conf[V3l]=$[f3l][X0c];}setTimeout(function(){var e3l="dateImage";var A3l="both";var h3l="Format";var c3l="picker-div";var E3l="#ui-date";var b3c=v9R;b3c+=e4c;var L3c=e2R;L3c+=z2R;var W3c=v4c;W3c+=R5l.z2c;W3c+=R5l.z2c;var F3c=E3l;F3c+=c3l;var l0c=Z9c;l0c+=m9c;l0c+=G2c;l0c+=R5l.z2c;var M0c=J2c;M0c+=R5l.Y2c;M0c+=h3l;var J0c=J2c;J0c+=R5l.Y2c;J0c+=m9c;J0c+=N3l;var H0c=k9c;H0c+=f9c;H0c+=y2R;$(conf[H0c])[J0c]($[H3R]({showOn:A3l,dateFormat:conf[M0c],buttonImage:conf[e3l],buttonImageOnly:K0R,onSelect:function(){var B3l="cli";var k0c=B3l;k0c+=Y1c;conf[B4n][h2R]()[k0c]();}},conf[l0c]));$(F3c)[W3c](L3c,b3c);},z5c);}else{var g3c=t6k;g3c+=D8c;var R3c=k9c;R3c+=g0R;R3c+=m9c;R3c+=L5k;conf[R3c][g3c](i3l,t3l);}return conf[x3c][A5c];},set:function(conf,val){var d3l="cha";var C3l="epic";var K3l="hasDat";var m3c=K3l;m3c+=C3l;m3c+=z3l;var Y3c=k9c;Y3c+=O0R;var y3c=r3l;y3c+=U3l;y3c+=D8c;if($[y3c]&&conf[Y3c][M6R](m3c)){var D3c=d3l;D3c+=H2c;D3c+=D1c;var Z3c=G4c;Z3c+=x9c;Z3c+=t7R;Z3c+=R5l.Y2c;var V3c=s0l;V3c+=L5k;conf[V3c][f3l](Z3c,val)[D3c]();}else{var f3c=Q3R;f3c+=R5l.R2c;f3c+=L9c;$(conf[B4n])[f3c](val);}},enable:function(conf){var w3l="enable";var p3l="tepic";if($[f3l]){var c3c=I3R;c3c+=p3l;c3c+=z3l;var E3c=Q1n;E3c+=G2c;conf[E3c][c3c](w3l);}else{var h3c=R5l.x2c;h3c+=d9R;h3c+=v0R;h3c+=e5R;$(conf[B4n])[L1n](h3c,t0R);}},disable:function(conf){var Q3l="disab";var s3l="datepi";var N3c=s3l;N3c+=S3l;if($[N3c]){var e3c=r3l;e3c+=N3l;var A3c=B8R;A3c+=H2c;A3c+=m9c;A3c+=L5k;conf[A3c][e3c](Y9k);}else{var i3c=Q3l;i3c+=e5R;var B3c=B8R;B3c+=H2c;B3c+=f2R;$(conf[B3c])[L1n](i3c,K0R);}},owns:function(conf,node){var I3l='div.ui-datepicker';var j3l="rent";var T3l="er-header";var O3l="pick";var v3l=".ui-date";var r3c=R5l.w2c;r3c+=c4k;var z3c=L0z;z3c+=v3l;z3c+=O3l;z3c+=T3l;var C3c=m4k;C3c+=j3l;C3c+=R5l.z2c;var K3c=L9c;K3c+=h0R;var t3c=m9c;t3c+=R5l.R2c;t3c+=D8c;t3c+=X2z;return $(node)[t3c](I3l)[K3c]||$(node)[C3c](z3c)[r3c]?K0R:t0R;}});fieldTypes[P3l]=$[U3c](K0R,{},baseFieldType,{create:function(conf){var u3l='keydown';var G3l="keyInput";var n3l="put />";var a3l="<in";var q3l="closeF";var o3c=o7c;o3c+=L9c;o3c+=s4R;o3c+=V6R;var n3c=v4c;n3c+=L9c;n3c+=P4c;n3c+=R5l.Y2c;var a3c=Z9c;a3c+=H2c;var T3c=k9c;T3c+=q3l;T3c+=H2c;var O3c=Z9c;O3c+=m9c;O3c+=b9c;var v3c=J2c;v3c+=R5l.Y2c;v3c+=y5n;var Q3c=f9c;Q3c+=V1c;Q3c+=s0z;var S3c=t7R;S3c+=I5k;var s3c=f9c;s3c+=R5l.x2c;var w3c=o2c;w3c+=G2c;w3c+=R5l.Y2c;w3c+=m8c;var p3c=a3l;p3c+=n3l;var d3c=k9c;d3c+=W1n;d3c+=L5k;conf[d3c]=$(p3c)[P4z]($[w3c](K0R,{id:Editor[e6R](conf[s3c]),type:m1n},conf[S3c]));conf[o3l]=new Editor[T0n](conf[B4n],$[H3R]({format:conf[i3n],i18n:this[Q3c][v3c],onChange:function(){_triggerChange(conf[B4n]);}},conf[O3c]));conf[T3c]=function(){var I3c=f8c;I3c+=f9c;I3c+=R5l.x2c;I3c+=R5l.Y2c;var j3c=x7c;j3c+=U3l;j3c+=D8c;conf[j3c][I3c]();};if(conf[G3l]===t0R){var P3c=k9c;P3c+=O0R;conf[P3c][W5R](u3l,function(e){var X3l="preven";var q3c=X3l;q3c+=t8n;q3c+=L1c;q3c+=b1c;e[q3c]();});}this[a3c](n3c,conf[o3c]);return conf[B4n][A5c];},set:function(conf,val){var u3c=B8R;u3c+=H2c;u3c+=m9c;u3c+=L5k;var G3c=k9c;G3c+=m9c;G3c+=y8c;G3c+=z3l;conf[G3c][a2R](val);_triggerChange(conf[u3c]);},owns:function(conf,node){var H3c=K8R;H3c+=c9k;var X3c=x7c;X3c+=f9c;X3c+=S3l;return conf[X3c][H3c](node);},errorMessage:function(conf,msg){var J3l="picker";var H3l="Msg";var M3c=H5R;M3c+=H3l;var J3c=k9c;J3c+=J3l;conf[J3c][M3c](msg);},destroy:function(conf){var W6l="seFn";var F6l="_clo";var l3l="own";var k3l="keyd";var M3l="pic";var b6c=k9c;b6c+=M3l;b6c+=e9R;b6c+=R5l.A2c;var L6c=k3l;L6c+=l3l;var W6c=k9c;W6c+=g0R;W6c+=m9c;W6c+=L5k;var F6c=F6l;F6c+=W6l;var l3c=q4c;l3c+=Z9c;l3c+=T4c;var k3c=c7R;k3c+=R5l.m2c;this[k3c](l3c,conf[F6c]);conf[W6c][C8k](L6c);conf[b6c][L9k]();},minDate:function(conf,min){conf[o3l][G6n](min);},maxDate:function(conf,max){conf[o3l][b4R](max);}});fieldTypes[B4k]=$[R6c](K0R,{},baseFieldType,{create:function(conf){var editor=this;var container=_commonUpload(editor,conf,function(val){var x6c=R5l.z2c;x6c+=R5l.Y2c;x6c+=G2c;var g6c=J7n;g6c+=H7c;Editor[g6c][B4k][x6c][Y5R](editor,conf,val[A5c]);});return container;},get:function(conf){return conf[b1n];},set:function(conf,val){var N6l="noCl";var h6l='noClear';var c6l="clearText";var E6l="removeC";var f6l="ppen";var Z6l="eTe";var V6l="noF";var m6l="No ";var Y6l="endered";var y6l="_v";var x6l="earValue b";var g6l="div.cl";var R6l="Tex";var b6l="ndler";var L6l="ggerHa";var r6c=k9c;r6c+=l6R;r6c+=L9c;var z6c=G2c;z6c+=C8c;z6c+=L6l;z6c+=b6l;var C6c=g0R;C6c+=f2R;var K6c=B8R;K6c+=y2R;var e6c=k5k;e6c+=R6l;e6c+=G2c;var A6c=g6l;A6c+=x6l;A6c+=r3n;var N6c=H2k;N6c+=R5l.x2c;var Y6c=k9c;Y6c+=f9c;Y6c+=H2c;Y6c+=f2R;var y6c=y6l;y6c+=R5l.R2c;y6c+=L9c;conf[y6c]=val;var container=conf[Y6c];if(conf[y8R]){var Z6c=k9c;Z6c+=Q3R;Z6c+=R5l.R2c;Z6c+=L9c;var V6c=L0z;V6c+=L4c;V6c+=D8c;V6c+=Y6l;var m6c=R5l.m2c;m6c+=g0R;m6c+=R5l.x2c;var rendered=container[m6c](V6c);if(conf[Z6c]){var D6c=f8c;D6c+=G2c;D6c+=R5l.g2c;D6c+=L9c;rendered[D6c](conf[y8R](conf[b1n]));}else{var h6c=m6l;h6c+=X7c;h6c+=R5l.Y2c;var c6c=V6l;c6c+=k7c;c6c+=Z6l;c6c+=p2k;var E6c=D6l;E6c+=m9c;E6c+=V7R;E6c+=u0R;var f6c=R5l.R2c;f6c+=f6l;f6c+=R5l.x2c;rendered[O5k]()[f6c](E6c+(conf[c6c]||h6c)+p6R);}}var button=container[N6c](A6c);if(val&&conf[e6c]){var i6c=E6l;i6c+=t3R;i6c+=e7R;var B6c=f8c;B6c+=G2c;B6c+=R5l.g2c;B6c+=L9c;button[B6c](conf[c6l]);container[i6c](h6l);}else{var t6c=N6l;t6c+=R5l.Y2c;t6c+=R5l.R2c;t6c+=D8c;container[K5R](t6c);}conf[K6c][c8k](C6c)[z6c](A6l,[conf[r6c]]);},enable:function(conf){var e6l="_en";var p6c=e6l;p6c+=F1n;var d6c=R5l.x2c;d6c+=f9c;d6c+=R5l.z2c;d6c+=F1n;var U6c=k9c;U6c+=O0R;conf[U6c][c8k](Y2R)[L1n](d6c,t0R);conf[p6c]=K0R;},disable:function(conf){var B6l="bled";var s6c=A5R;s6c+=B6l;var w6c=f9c;w6c+=H2c;w6c+=b0R;w6c+=G2c;conf[B4n][c8k](w6c)[L1n](s6c,K0R);conf[i4n]=t0R;},canReturnSubmit:function(conf,node){return t0R;}});fieldTypes[S6c]=$[Q6c](K0R,{},baseFieldType,{create:function(conf){var r6l='multi';var i6l="button.r";var P6c=i6l;P6c+=n4R;P6c+=o4R;var I6c=z4R;I6c+=e9R;var editor=this;var container=_commonUpload(editor,conf,function(val){var C6l="ieldTy";var K6l="Many";var t6l="pload";var j6c=k9R;j6c+=L9c;j6c+=L9c;var T6c=E8c;T6c+=t6l;T6c+=K6l;var O6c=R5l.m2c;O6c+=C6l;O6c+=z6l;var v6c=k9c;v6c+=a2R;conf[b1n]=conf[v6c][P6k](val);Editor[O6c][T6c][G4c][j6c](editor,conf,conf[b1n]);});container[K5R](r6l)[W5R](I6c,P6c,function(e){var p6l="uploadMany";var d6l='idx';var U6l="stopPropagation";var a6c=R5l.z2c;a6c+=R5l.Y2c;a6c+=G2c;var q6c=R5l.x2c;q6c+=R5l.R2c;q6c+=G2c;q6c+=R5l.R2c;e[U6l]();var idx=$(this)[q6c](d6l);conf[b1n][a3k](idx,e5c);Editor[J4n][p6l][a6c][Y5R](editor,conf,conf[b1n]);});return container;},get:function(conf){var n6c=k9c;n6c+=Q3R;n6c+=R5l.R2c;n6c+=L9c;return conf[n6c];},set:function(conf,val){var n6l="noFileText";var a6l="No fi";var q6l="/s";var s6l='<ul/>';var w6l='Upload collections must have an array as a value';var R5c=g0R;R5c+=b0R;R5c+=G2c;var G6c=w4c;G6c+=R5l.R2c;G6c+=R5l.e2c;var o6c=k9c;o6c+=l6R;o6c+=L9c;if(!val){val=[];}if(!$[V9R](val)){throw w6l;}conf[o6c]=val;var that=this;var container=conf[B4n];if(conf[G6c]){var X6c=L9c;X6c+=R5l.Y2c;X6c+=c0R;X6c+=X4k;var u6c=R5l.m2c;u6c+=f9c;u6c+=m8c;var rendered=container[u6c](X4n)[O5k]();if(val[X6c]){var list=$(s6l)[X6k](rendered);$[u2R](val,function(i,file){var P6l='</li>';var I6l=' remove" data-idx="';var j6l="<li";var T6l="n class=\"";var O6l=" <butto";var v6l="/button>";var Q6l="mes;<";var S6l="\">&";var F5c=S6l;F5c+=u4c;F5c+=Q6l;F5c+=v6l;var l6c=R5l.p2c;l6c+=E8c;l6c+=E3n;l6c+=H2c;var k6c=R5l.m2c;k6c+=Z9c;k6c+=D8c;k6c+=R5l.g2c;var M6c=O6l;M6c+=T6l;var J6c=j6l;J6c+=u0R;var H6c=C8R;H6c+=H8c;H6c+=m8c;list[H6c](J6c+conf[y8R](file,i)+M6c+that[G5R][k6c][l6c]+I6l+i+F5c+P6l);});}else{var b5c=k0R;b5c+=q6l;b5c+=m4k;b5c+=c3n;var L5c=a6l;L5c+=K4c;var W5c=D6l;W5c+=m9c;W5c+=R5l.R2c;W5c+=c3n;rendered[p8R](W5c+(conf[n6l]||L5c)+b5c);}}conf[B4n][c8k](R5c)[b5z](A6l,[conf[b1n]]);},enable:function(conf){var o6l="sabled";var Y5c=u6R;Y5c+=o6l;var y5c=f9c;y5c+=n6n;y5c+=G2c;var x5c=R5l.m2c;x5c+=f9c;x5c+=m8c;var g5c=s0l;g5c+=L5k;conf[g5c][x5c](y5c)[L1n](Y5c,t0R);conf[i4n]=K0R;},disable:function(conf){var V5c=u6R;V5c+=C9k;V5c+=R5l.p2c;V5c+=e5R;var m5c=m9c;m5c+=t7c;m5c+=m9c;conf[B4n][c8k](Y2R)[m5c](V5c,K0R);conf[i4n]=t0R;},canReturnSubmit:function(conf,node){return t0R;}});}());if(DataTable[Q3z][Z5c]){var E5c=k2c;E5c+=Z8c;E5c+=K6z;var f5c=R5l.Y2c;f5c+=p2k;var D5c=b2k;D5c+=R4z;D5c+=z6l;$[H3R](Editor[D5c],DataTable[f5c][E5c]);}DataTable[c5c][G6l]=Editor[J4n];Editor[V0R]={};Editor[h5c][N5c]=u6l;Editor[X6l]=H6l;return Editor;}));

/*! Bootstrap integration for DataTables' Editor
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs', 'datatables.net-editor'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs')(root, $).$;
			}

			if ( ! $.fn.dataTable.Editor ) {
				require('datatables.net-editor')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/*
 * Set the default display controller to be our bootstrap control 
 */
DataTable.Editor.defaults.display = "bootstrap";


/*
 * Alter the buttons that Editor adds to TableTools so they are suitable for bootstrap
 */
var i18nDefaults = DataTable.Editor.defaults.i18n;
i18nDefaults.create.title = "<h3>"+i18nDefaults.create.title+"</h3>";
i18nDefaults.edit.title = "<h3>"+i18nDefaults.edit.title+"</h3>";
i18nDefaults.remove.title = "<h3>"+i18nDefaults.remove.title+"</h3>";

var tt = DataTable.TableTools;
if ( tt ) {
	tt.BUTTONS.editor_create.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_edit.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_remove.formButtons[0].className = "btn btn-danger";
}


/*
 * Change the default classes from Editor to be classes for Bootstrap
 */
$.extend( true, $.fn.dataTable.Editor.classes, {
	"header": {
		"wrapper": "DTE_Header modal-header"
	},
	"body": {
		"wrapper": "DTE_Body modal-body"
	},
	"footer": {
		"wrapper": "DTE_Footer modal-footer"
	},
	"form": {
		"tag": "form-horizontal",
		"button": "btn btn-default"
	},
	"field": {
		"wrapper": "DTE_Field",
		"label":   "col-lg-4 control-label",
		"input":   "col-lg-8 controls",
		"error":   "error has-error",
		"msg-labelInfo": "help-block",
		"msg-info":      "help-block",
		"msg-message":   "help-block",
		"msg-error":     "help-block",
		"multiValue":    "well well-sm multi-value",
		"multiInfo":     "small",
		"multiRestore":  "well well-sm multi-restore"
	}
} );

$.extend( true, DataTable.ext.buttons, {
	create: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	edit: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	remove: {
		formButtons: {
			className: 'btn-danger'
		}
	}
} );


/*
 * Bootstrap display controller - this is effectively a proxy to the Bootstrap
 * modal control.
 */

var self;

DataTable.Editor.display.bootstrap = $.extend( true, {}, DataTable.Editor.models.displayController, {
	/*
	 * API methods
	 */
	"init": function ( dte ) {
		// init can be called multiple times (one for each Editor instance), but
		// we only support a single construct here (shared between all Editor
		// instances)
		if ( ! self._dom.content ) {
			self._dom.content = $(
				'<div class="modal fade">'+
					'<div class="modal-dialog">'+
						'<div class="modal-content"/>'+
					'</div>'+
				'</div>'
			);

			self._dom.close = $('<button class="close">&times;</div>');
			self._dom.modalContent = self._dom.content.find('div.modal-content');

			self._dom.close.click( function () {
				self._dte.close('icon');
			} );

			$(document).on('click', 'div.modal', function (e) {
				if ( $(e.target).hasClass('modal') && self._shown ) {
					self._dte.background();
				}
			} );
		}

		// Add `form-control` to required elements
		dte.on( 'displayOrder.dtebs', function ( e, display, action, form ) {
			$.each( dte.s.fields, function ( key, field ) {
				$('input:not([type=checkbox]):not([type=radio]), select, textarea', field.node() )
					.addClass( 'form-control' );
			} );
		} );

		return self;
	},

	"open": function ( dte, append, callback ) {
		if ( self._shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		self._dte = dte;
		self._shown = true;

		var content = self._dom.modalContent;
		content.children().detach();
		content.append( append );

		$('div.modal-header', append).prepend( self._dom.close );

		$(self._dom.content)
			.one('shown.bs.modal', function () {
				// Can only give elements focus when shown
				if ( self._dte.s.setFocus ) {
					self._dte.s.setFocus.focus();
				}

				if ( callback ) {
					callback();
				}
			})
			.one('hidden', function () {
				self._shown = false;
			})
			.appendTo( 'body' )
			.modal( {
				backdrop: "static",
				keyboard: false
			} );
	},

	"close": function ( dte, callback ) {
		if ( !self._shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		$(self._dom.content)
			.one( 'hidden.bs.modal', function () {
				$(this).detach();
			} )
			.modal('hide');

		self._dte = dte;
		self._shown = false;

		if ( callback ) {
			callback();
		}
	},

	node: function ( dte ) {
		return self._dom.content[0];
	},


	/*
	 * Private properties
	 */
	 "_shown": false,
	"_dte": null,
	"_dom": {}
} );

self = DataTable.Editor.display.bootstrap;


return DataTable.Editor;
}));


/*! AutoFill 2.2.2
 * ©2008-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     AutoFill
 * @description Add Excel like click and drag auto-fill options to DataTables
 * @version     2.2.2
 * @file        dataTables.autoFill.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2010-2017 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


var _instance = 0;

/** 
 * AutoFill provides Excel like auto-fill features for a DataTable
 *
 * @class AutoFill
 * @constructor
 * @param {object} oTD DataTables settings object
 * @param {object} oConfig Configuration object for AutoFill
 */
var AutoFill = function( dt, opts )
{
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.8' ) ) {
		throw( "Warning: AutoFill requires DataTables 1.10.8 or greater");
	}

	// User and defaults configuration object
	this.c = $.extend( true, {},
		DataTable.defaults.autoFill,
		AutoFill.defaults,
		opts
	);

	/**
	 * @namespace Settings object which contains customisable information for AutoFill instance
	 */
	this.s = {
		/** @type {DataTable.Api} DataTables' API instance */
		dt: new DataTable.Api( dt ),

		/** @type {String} Unique namespace for events attached to the document */
		namespace: '.autoFill'+(_instance++),

		/** @type {Object} Cached dimension information for use in the mouse move event handler */
		scroll: {},

		/** @type {integer} Interval object used for smooth scrolling */
		scrollInterval: null,

		handle: {
			height: 0,
			width: 0
		},

		/**
		 * Enabled setting
		 * @type {Boolean}
		 */
		enabled: false
	};


	/**
	 * @namespace Common and useful DOM elements for the class instance
	 */
	this.dom = {
		/** @type {jQuery} AutoFill handle */
		handle: $('<div class="dt-autofill-handle"/>'),

		/**
		 * @type {Object} Selected cells outline - Need to use 4 elements,
		 *   otherwise the mouse over if you back into the selected rectangle
		 *   will be over that element, rather than the cells!
		 */
		select: {
			top:    $('<div class="dt-autofill-select top"/>'),
			right:  $('<div class="dt-autofill-select right"/>'),
			bottom: $('<div class="dt-autofill-select bottom"/>'),
			left:   $('<div class="dt-autofill-select left"/>')
		},

		/** @type {jQuery} Fill type chooser background */
		background: $('<div class="dt-autofill-background"/>'),

		/** @type {jQuery} Fill type chooser */
		list: $('<div class="dt-autofill-list">'+this.s.dt.i18n('autoFill.info', '')+'<ul/></div>'),

		/** @type {jQuery} DataTables scrolling container */
		dtScroll: null,

		/** @type {jQuery} Offset parent element */
		offsetParent: null
	};


	/* Constructor logic */
	this._constructor();
};



$.extend( AutoFill.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods (exposed via the DataTables API below)
	 */
	enabled: function ()
	{
		return this.s.enabled;
	},


	enable: function ( flag )
	{
		var that = this;

		if ( flag === false ) {
			return this.disable();
		}

		this.s.enabled = true;

		this._focusListener();

		this.dom.handle.on( 'mousedown', function (e) {
			that._mousedown( e );
			return false;
		} );

		return this;
	},

	disable: function ()
	{
		this.s.enabled = false;

		this._focusListenerRemove();

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the RowReorder instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtScroll = $('div.dataTables_scrollBody', this.s.dt.table().container());

		// Make the instance accessible to the API
		dt.settings()[0].autoFill = this;

		if ( dtScroll.length ) {
			this.dom.dtScroll = dtScroll;

			// Need to scroll container to be the offset parent
			if ( dtScroll.css('position') === 'static' ) {
				dtScroll.css( 'position', 'relative' );
			}
		}

		if ( this.c.enable !== false ) {
			this.enable();
		}

		dt.on( 'destroy.autoFill', function () {
			that._focusListenerRemove();
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Display the AutoFill drag handle by appending it to a table cell. This
	 * is the opposite of the _detach method.
	 *
	 * @param  {node} node TD/TH cell to insert the handle into
	 * @private
	 */
	_attach: function ( node )
	{
		var dt = this.s.dt;
		var idx = dt.cell( node ).index();
		var handle = this.dom.handle;
		var handleDim = this.s.handle;

		if ( ! idx || dt.columns( this.c.columns ).indexes().indexOf( idx.column ) === -1 ) {
			this._detach();
			return;
		}

		if ( ! this.dom.offsetParent ) {
			// We attach to the table's offset parent
			this.dom.offsetParent = $( dt.table().node() ).offsetParent();
		}

		if ( ! handleDim.height || ! handleDim.width ) {
			// Append to document so we can get its size. Not expecting it to
			// change during the life time of the page
			handle.appendTo( 'body' );
			handleDim.height = handle.outerHeight();
			handleDim.width = handle.outerWidth();
		}

		// Might need to go through multiple offset parents
		var offset = this._getPosition( node, this.dom.offsetParent );

		this.dom.attachedTo = node;
		handle
			.css( {
				top: offset.top + node.offsetHeight - handleDim.height,
				left: offset.left + node.offsetWidth - handleDim.width
			} )
			.appendTo( this.dom.offsetParent );
	},


	/**
	 * Determine can the fill type should be. This can be automatic, or ask the
	 * end user.
	 *
	 * @param {array} cells Information about the selected cells from the key
	 *     up function
	 * @private
	 */
	_actionSelector: function ( cells )
	{
		var that = this;
		var dt = this.s.dt;
		var actions = AutoFill.actions;
		var available = [];

		// "Ask" each plug-in if it wants to handle this data
		$.each( actions, function ( key, action ) {
			if ( action.available( dt, cells ) ) {
				available.push( key );
			}
		} );

		if ( available.length === 1 && this.c.alwaysAsk === false ) {
			// Only one action available - enact it immediately
			var result = actions[ available[0] ].execute( dt, cells );
			this._update( result, cells );
		}
		else {
			// Multiple actions available - ask the end user what they want to do
			var list = this.dom.list.children('ul').empty();

			// Add a cancel option
			available.push( 'cancel' );

			$.each( available, function ( i, name ) {
				list.append( $('<li/>')
					.append(
						'<div class="dt-autofill-question">'+
							actions[ name ].option( dt, cells )+
						'<div>'
					)
					.append( $('<div class="dt-autofill-button">' )
						.append( $('<button class="'+AutoFill.classes.btn+'">'+dt.i18n('autoFill.button', '&gt;')+'</button>')
							.on( 'click', function () {
								var result = actions[ name ].execute(
									dt, cells, $(this).closest('li')
								);
								that._update( result, cells );

								that.dom.background.remove();
								that.dom.list.remove();
							} )
						)
					)
				);
			} );

			this.dom.background.appendTo( 'body' );
			this.dom.list.appendTo( 'body' );

			this.dom.list.css( 'margin-top', this.dom.list.outerHeight()/2 * -1 );
		}
	},


	/**
	 * Remove the AutoFill handle from the document
	 *
	 * @private
	 */
	_detach: function ()
	{
		this.dom.attachedTo = null;
		this.dom.handle.detach();
	},


	/**
	 * Draw the selection outline by calculating the range between the start
	 * and end cells, then placing the highlighting elements to draw a rectangle
	 *
	 * @param  {node}   target End cell
	 * @param  {object} e      Originating event
	 * @private
	 */
	_drawSelection: function ( target, e )
	{
		// Calculate boundary for start cell to this one
		var dt = this.s.dt;
		var start = this.s.start;
		var startCell = $(this.dom.start);
		var endCell = $(target);
		var end = {
			row: dt.rows( { page: 'current' } ).nodes().indexOf( endCell.parent()[0] ),
			column: endCell.index()
		};
		var colIndx = dt.column.index( 'toData', end.column );

		// Be sure that is a DataTables controlled cell
		if ( ! dt.cell( endCell ).any() ) {
			return;
		}

		// if target is not in the columns available - do nothing
		if ( dt.columns( this.c.columns ).indexes().indexOf( colIndx ) === -1 ) {
			return;
		}

		this.s.end = end;

		var top, bottom, left, right, height, width;

		top    = start.row    < end.row    ? startCell : endCell;
		bottom = start.row    < end.row    ? endCell   : startCell;
		left   = start.column < end.column ? startCell : endCell;
		right  = start.column < end.column ? endCell   : startCell;

		top    = this._getPosition( top ).top;
		left   = this._getPosition( left ).left;
		height = this._getPosition( bottom ).top + bottom.outerHeight() - top;
		width  = this._getPosition( right ).left + right.outerWidth() - left;

		var select = this.dom.select;
		select.top.css( {
			top: top,
			left: left,
			width: width
		} );

		select.left.css( {
			top: top,
			left: left,
			height: height
		} );

		select.bottom.css( {
			top: top + height,
			left: left,
			width: width
		} );

		select.right.css( {
			top: top,
			left: left + width,
			height: height
		} );
	},


	/**
	 * Use the Editor API to perform an update based on the new data for the
	 * cells
	 *
	 * @param {array} cells Information about the selected cells from the key
	 *     up function
	 * @private
	 */
	_editor: function ( cells )
	{
		var dt = this.s.dt;
		var editor = this.c.editor;

		if ( ! editor ) {
			return;
		}

		// Build the object structure for Editor's multi-row editing
		var idValues = {};
		var nodes = [];
		var fields = editor.fields();

		for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
			for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
				var cell = cells[i][j];

				// Determine the field name for the cell being edited
				var col = dt.settings()[0].aoColumns[ cell.index.column ];
				var fieldName = col.editField;

				if ( fieldName === undefined ) {
					var dataSrc = col.mData;

					// dataSrc is the `field.data` property, but we need to set
					// using the field name, so we need to translate from the
					// data to the name
					for ( var k=0, ken=fields.length ; k<ken ; k++ ) {
						var field = editor.field( fields[k] );

						if ( field.dataSrc() === dataSrc ) {
							fieldName = field.name();
							break;
						}
					}
				}

				if ( ! fieldName ) {
					throw 'Could not automatically determine field data. '+
						'Please see https://datatables.net/tn/11';
				}

				if ( ! idValues[ fieldName ] ) {
					idValues[ fieldName ] = {};
				}

				var id = dt.row( cell.index.row ).id();
				idValues[ fieldName ][ id ] = cell.set;

				// Keep a list of cells so we can activate the bubble editing
				// with them
				nodes.push( cell.index );
			}
		}

		// Perform the edit using bubble editing as it allows us to specify
		// the cells to be edited, rather than using full rows
		editor
			.bubble( nodes, false )
			.multiSet( idValues )
			.submit();
	},


	/**
	 * Emit an event on the DataTable for listeners
	 *
	 * @param  {string} name Event name
	 * @param  {array} args Event arguments
	 * @private
	 */
	_emitEvent: function ( name, args )
	{
		this.s.dt.iterator( 'table', function ( ctx, i ) {
			$(ctx.nTable).triggerHandler( name+'.dt', args );
		} );
	},


	/**
	 * Attach suitable listeners (based on the configuration) that will attach
	 * and detach the AutoFill handle in the document.
	 *
	 * @private
	 */
	_focusListener: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var namespace = this.s.namespace;
		var focus = this.c.focus !== null ?
			this.c.focus :
			dt.init().keys || dt.settings()[0].keytable ?
				'focus' :
				'hover';

		// All event listeners attached here are removed in the `destroy`
		// callback in the constructor
		if ( focus === 'focus' ) {
			dt
				.on( 'key-focus.autoFill', function ( e, dt, cell ) {
					that._attach( cell.node() );
				} )
				.on( 'key-blur.autoFill', function ( e, dt, cell ) {
					that._detach();
				} );
		}
		else if ( focus === 'click' ) {
			$(dt.table().body()).on( 'click'+namespace, 'td, th', function (e) {
				that._attach( this );
			} );

			$(document.body).on( 'click'+namespace, function (e) {
				if ( ! $(e.target).parents().filter( dt.table().body() ).length ) {
					that._detach();
				}
			} );
		}
		else {
			$(dt.table().body())
				.on( 'mouseenter'+namespace, 'td, th', function (e) {
					that._attach( this );
				} )
				.on( 'mouseleave'+namespace, function (e) {
					if ( $(e.relatedTarget).hasClass('dt-autofill-handle') ) {
						return;
					}

					that._detach();
				} );
		}
	},


	_focusListenerRemove: function ()
	{
		var dt = this.s.dt;

		dt.off( '.autoFill' );
		$(dt.table().body()).off( this.s.namespace );
		$(document.body).off( this.s.namespace );
	},


	/**
	 * Get the position of a node, relative to another, including any scrolling
	 * offsets.
	 * @param  {Node}   node         Node to get the position of
	 * @param  {jQuery} targetParent Node to use as the parent
	 * @return {object}              Offset calculation
	 * @private
	 */
	_getPosition: function ( node, targetParent )
	{
		var
			currNode = $(node),
			currOffsetParent,
			position,
			top = 0,
			left = 0;

		if ( ! targetParent ) {
			targetParent = $( this.s.dt.table().node() ).offsetParent();
		}

		do {
			position = currNode.position();
			currOffsetParent = currNode.offsetParent();

			top += position.top + currOffsetParent.scrollTop();
			left += position.left + currOffsetParent.scrollLeft();

			// Emergency fall back. Shouldn't happen, but just in case!
			if ( currNode.get(0).nodeName.toLowerCase() === 'body' ) {
				break;
			}

			currNode = currOffsetParent; // for next loop
		}
		while ( currOffsetParent.get(0) !== targetParent.get(0) )

		return {
			top: top,
			left: left
		};
	},


	/**
	 * Start mouse drag - selects the start cell
	 *
	 * @param  {object} e Mouse down event
	 * @private
	 */
	_mousedown: function ( e )
	{
		var that = this;
		var dt = this.s.dt;

		this.dom.start = this.dom.attachedTo;
		this.s.start = {
			row: dt.rows( { page: 'current' } ).nodes().indexOf( $(this.dom.start).parent()[0] ),
			column: $(this.dom.start).index()
		};

		$(document.body)
			.on( 'mousemove.autoFill', function (e) {
				that._mousemove( e );
			} )
			.on( 'mouseup.autoFill', function (e) {
				that._mouseup( e );
			} );

		var select = this.dom.select;
		var offsetParent = $( dt.table().node() ).offsetParent();
		select.top.appendTo( offsetParent );
		select.left.appendTo( offsetParent );
		select.right.appendTo( offsetParent );
		select.bottom.appendTo( offsetParent );

		this._drawSelection( this.dom.start, e );

		this.dom.handle.css( 'display', 'none' );

		// Cache scrolling information so mouse move doesn't need to read.
		// This assumes that the window and DT scroller will not change size
		// during an AutoFill drag, which I think is a fair assumption
		var scrollWrapper = this.dom.dtScroll;
		this.s.scroll = {
			windowHeight: $(window).height(),
			windowWidth:  $(window).width(),
			dtTop:        scrollWrapper ? scrollWrapper.offset().top : null,
			dtLeft:       scrollWrapper ? scrollWrapper.offset().left : null,
			dtHeight:     scrollWrapper ? scrollWrapper.outerHeight() : null,
			dtWidth:      scrollWrapper ? scrollWrapper.outerWidth() : null
		};
	},


	/**
	 * Mouse drag - selects the end cell and update the selection display for
	 * the end user
	 *
	 * @param  {object} e Mouse move event
	 * @private
	 */
	_mousemove: function ( e )
	{	
		var that = this;
		var dt = this.s.dt;
		var name = e.target.nodeName.toLowerCase();
		if ( name !== 'td' && name !== 'th' ) {
			return;
		}

		this._drawSelection( e.target, e );
		this._shiftScroll( e );
	},


	/**
	 * End mouse drag - perform the update actions
	 *
	 * @param  {object} e Mouse up event
	 * @private
	 */
	_mouseup: function ( e )
	{
		$(document.body).off( '.autoFill' );

		var dt = this.s.dt;
		var select = this.dom.select;
		select.top.remove();
		select.left.remove();
		select.right.remove();
		select.bottom.remove();

		this.dom.handle.css( 'display', 'block' );

		// Display complete - now do something useful with the selection!
		var start = this.s.start;
		var end = this.s.end;

		// Haven't selected multiple cells, so nothing to do
		if ( start.row === end.row && start.column === end.column ) {
			return;
		}

		// Build a matrix representation of the selected rows
		var rows       = this._range( start.row, end.row );
		var columns    = this._range( start.column, end.column );
		var selected   = [];
		var dtSettings = dt.settings()[0];
		var dtColumns  = dtSettings.aoColumns;

		// Can't use Array.prototype.map as IE8 doesn't support it
		// Can't use $.map as jQuery flattens 2D arrays
		// Need to use a good old fashioned for loop
		for ( var rowIdx=0 ; rowIdx<rows.length ; rowIdx++ ) {
			selected.push(
				$.map( columns, function (column) {
					var cell = dt.cell( ':eq('+rows[rowIdx]+')', column+':visible', {page:'current'} );
					var data = cell.data();
					var cellIndex = cell.index();
					var editField = dtColumns[ cellIndex.column ].editField;

					if ( editField !== undefined ) {
						data = dtSettings.oApi._fnGetObjectDataFn( editField )( dt.row( cellIndex.row ).data() );
					}

					return {
						cell:  cell,
						data:  data,
						label: cell.data(),
						index: cellIndex
					};
				} )
			);
		}

		this._actionSelector( selected );
		
		// Stop shiftScroll
		clearInterval( this.s.scrollInterval );
		this.s.scrollInterval = null;
	},


	/**
	 * Create an array with a range of numbers defined by the start and end
	 * parameters passed in (inclusive!).
	 * 
	 * @param  {integer} start Start
	 * @param  {integer} end   End
	 * @private
	 */
	_range: function ( start, end )
	{
		var out = [];
		var i;

		if ( start <= end ) {
			for ( i=start ; i<=end ; i++ ) {
				out.push( i );
			}
		}
		else {
			for ( i=start ; i>=end ; i-- ) {
				out.push( i );
			}
		}

		return out;
	},


	/**
	 * Move the window and DataTables scrolling during a drag to scroll new
	 * content into view. This is done by proximity to the edge of the scrolling
	 * container of the mouse - for example near the top edge of the window
	 * should scroll up. This is a little complicated as there are two elements
	 * that can be scrolled - the window and the DataTables scrolling view port
	 * (if scrollX and / or scrollY is enabled).
	 *
	 * @param  {object} e Mouse move event object
	 * @private
	 */
	_shiftScroll: function ( e )
	{
		var that = this;
		var dt = this.s.dt;
		var scroll = this.s.scroll;
		var runInterval = false;
		var scrollSpeed = 5;
		var buffer = 65;
		var
			windowY = e.pageY - document.body.scrollTop,
			windowX = e.pageX - document.body.scrollLeft,
			windowVert, windowHoriz,
			dtVert, dtHoriz;

		// Window calculations - based on the mouse position in the window,
		// regardless of scrolling
		if ( windowY < buffer ) {
			windowVert = scrollSpeed * -1;
		}
		else if ( windowY > scroll.windowHeight - buffer ) {
			windowVert = scrollSpeed;
		}

		if ( windowX < buffer ) {
			windowHoriz = scrollSpeed * -1;
		}
		else if ( windowX > scroll.windowWidth - buffer ) {
			windowHoriz = scrollSpeed;
		}

		// DataTables scrolling calculations - based on the table's position in
		// the document and the mouse position on the page
		if ( scroll.dtTop !== null && e.pageY < scroll.dtTop + buffer ) {
			dtVert = scrollSpeed * -1;
		}
		else if ( scroll.dtTop !== null && e.pageY > scroll.dtTop + scroll.dtHeight - buffer ) {
			dtVert = scrollSpeed;
		}

		if ( scroll.dtLeft !== null && e.pageX < scroll.dtLeft + buffer ) {
			dtHoriz = scrollSpeed * -1;
		}
		else if ( scroll.dtLeft !== null && e.pageX > scroll.dtLeft + scroll.dtWidth - buffer ) {
			dtHoriz = scrollSpeed;
		}

		// This is where it gets interesting. We want to continue scrolling
		// without requiring a mouse move, so we need an interval to be
		// triggered. The interval should continue until it is no longer needed,
		// but it must also use the latest scroll commands (for example consider
		// that the mouse might move from scrolling up to scrolling left, all
		// with the same interval running. We use the `scroll` object to "pass"
		// this information to the interval. Can't use local variables as they
		// wouldn't be the ones that are used by an already existing interval!
		if ( windowVert || windowHoriz || dtVert || dtHoriz ) {
			scroll.windowVert = windowVert;
			scroll.windowHoriz = windowHoriz;
			scroll.dtVert = dtVert;
			scroll.dtHoriz = dtHoriz;
			runInterval = true;
		}
		else if ( this.s.scrollInterval ) {
			// Don't need to scroll - remove any existing timer
			clearInterval( this.s.scrollInterval );
			this.s.scrollInterval = null;
		}

		// If we need to run the interval to scroll and there is no existing
		// interval (if there is an existing one, it will continue to run)
		if ( ! this.s.scrollInterval && runInterval ) {
			this.s.scrollInterval = setInterval( function () {
				// Don't need to worry about setting scroll <0 or beyond the
				// scroll bound as the browser will just reject that.
				if ( scroll.windowVert ) {
					document.body.scrollTop += scroll.windowVert;
				}
				if ( scroll.windowHoriz ) {
					document.body.scrollLeft += scroll.windowHoriz;
				}

				// DataTables scrolling
				if ( scroll.dtVert || scroll.dtHoriz ) {
					var scroller = that.dom.dtScroll[0];

					if ( scroll.dtVert ) {
						scroller.scrollTop += scroll.dtVert;
					}
					if ( scroll.dtHoriz ) {
						scroller.scrollLeft += scroll.dtHoriz;
					}
				}
			}, 20 );
		}
	},


	/**
	 * Update the DataTable after the user has selected what they want to do
	 *
	 * @param  {false|undefined} result Return from the `execute` method - can
	 *   be false internally to do nothing. This is not documented for plug-ins
	 *   and is used only by the cancel option.
	 * @param {array} cells Information about the selected cells from the key
	 *     up function, argumented with the set values
	 * @private
	 */
	_update: function ( result, cells )
	{
		// Do nothing on `false` return from an execute function
		if ( result === false ) {
			return;
		}

		var dt = this.s.dt;
		var cell;

		// Potentially allow modifications to the cells matrix
		this._emitEvent( 'preAutoFill', [ dt, cells ] );

		this._editor( cells );

		// Automatic updates are not performed if `update` is null and the
		// `editor` parameter is passed in - the reason being that Editor will
		// update the data once submitted
		var update = this.c.update !== null ?
			this.c.update :
			this.c.editor ?
				false :
				true;

		if ( update ) {
			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cell = cells[i][j];

					cell.cell.data( cell.set );
				}
			}

			dt.draw(false);
		}

		this._emitEvent( 'autoFill', [ dt, cells ] );
	}
} );


/**
 * AutoFill actions. The options here determine how AutoFill will fill the data
 * in the table when the user has selected a range of cells. Please see the
 * documentation on the DataTables site for full details on how to create plug-
 * ins.
 *
 * @type {Object}
 */
AutoFill.actions = {
	increment: {
		available: function ( dt, cells ) {
			return $.isNumeric( cells[0][0].label );
		},

		option: function ( dt, cells ) {
			return dt.i18n(
				'autoFill.increment',
				'Increment / decrement each cell by: <input type="number" value="1">'
			);
		},

		execute: function ( dt, cells, node ) {
			var value = cells[0][0].data * 1;
			var increment = $('input', node).val() * 1;

			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = value;

					value += increment;
				}
			}
		}
	},

	fill: {
		available: function ( dt, cells ) {
			return true;
		},

		option: function ( dt, cells ) {
			return dt.i18n('autoFill.fill', 'Fill all cells with <i>'+cells[0][0].label+'</i>' );
		},

		execute: function ( dt, cells, node ) {
			var value = cells[0][0].data;

			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = value;
				}
			}
		}
	},

	fillHorizontal: {
		available: function ( dt, cells ) {
			return cells.length > 1 && cells[0].length > 1;
		},

		option: function ( dt, cells ) {
			return dt.i18n('autoFill.fillHorizontal', 'Fill cells horizontally' );
		},

		execute: function ( dt, cells, node ) {
			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = cells[i][0].data;
				}
			}
		}
	},

	fillVertical: {
		available: function ( dt, cells ) {
			return cells.length > 1 && cells[0].length > 1;
		},

		option: function ( dt, cells ) {
			return dt.i18n('autoFill.fillVertical', 'Fill cells vertically' );
		},

		execute: function ( dt, cells, node ) {
			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = cells[0][j].data;
				}
			}
		}
	},

	// Special type that does not make itself available, but is added
	// automatically by AutoFill if a multi-choice list is shown. This allows
	// sensible code reuse
	cancel: {
		available: function () {
			return false;
		},

		option: function ( dt ) {
			return dt.i18n('autoFill.cancel', 'Cancel' );
		},

		execute: function () {
			return false;
		}
	}
};


/**
 * AutoFill version
 * 
 * @static
 * @type      String
 */
AutoFill.version = '2.2.2';


/**
 * AutoFill defaults
 * 
 * @namespace
 */
AutoFill.defaults = {
	/** @type {Boolean} Ask user what they want to do, even for a single option */
	alwaysAsk: false,

	/** @type {string|null} What will trigger a focus */
	focus: null, // focus, click, hover

	/** @type {column-selector} Columns to provide auto fill for */
	columns: '', // all

	/** @type {Boolean} Enable AutoFill on load */
	enable: true,

	/** @type {boolean|null} Update the cells after a drag */
	update: null, // false is editor given, true otherwise

	/** @type {DataTable.Editor} Editor instance for automatic submission */
	editor: null
};


/**
 * Classes used by AutoFill that are configurable
 * 
 * @namespace
 */
AutoFill.classes = {
	/** @type {String} Class used by the selection button */
	btn: 'btn'
};


/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - Not documented
Api.register( 'autoFill()', function () {
	return this;
} );

Api.register( 'autoFill().enabled()', function () {
	var ctx = this.context[0];

	return ctx.autoFill ?
		ctx.autoFill.enabled() :
		false;
} );

Api.register( 'autoFill().enable()', function ( flag ) {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx.autoFill ) {
			ctx.autoFill.enable( flag );
		}
	} );
} );

Api.register( 'autoFill().disable()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx.autoFill ) {
			ctx.autoFill.disable();
		}
	} );
} );


// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.autofill', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.autoFill;
	var defaults = DataTable.defaults.autoFill;

	if ( init || defaults ) {
		var opts = $.extend( {}, init, defaults );

		if ( init !== false ) {
			new AutoFill( settings, opts  );
		}
	}
} );


// Alias for access
DataTable.AutoFill = AutoFill;
DataTable.AutoFill = AutoFill;


return AutoFill;
}));


/*! Bootstrap integration for DataTables' AutoFill
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs', 'datatables.net-autofill'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs')(root, $).$;
			}

			if ( ! $.fn.dataTable.AutoFill ) {
				require('datatables.net-autofill')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


DataTable.AutoFill.classes.btn = 'btn btn-primary';


return DataTable;
}));

/*! Buttons for DataTables 1.5.1
 * ©2016-2017 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

/**
 * [Buttons description]
 * @param {[type]}
 * @param {[type]}
 */
var Buttons = function( dt, config )
{
	// If there is no config set it to an empty object
	if ( typeof( config ) === 'undefined' ) {
		config = {};	
	}
	
	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if ( $.isArray( config ) ) {
		config = { buttons: config };
	}

	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb'+(_instCounter++)
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};


$.extend( Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 *//**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	action: function ( node, action )
	{
		var button = this._nodeToButton( node );

		if ( action === undefined ) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	active: function ( node, flag ) {
		var button = this._nodeToButton( node );
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if ( flag === undefined ) {
			return jqNode.hasClass( klass );
		}

		jqNode.toggleClass( klass, flag === undefined ? true : flag );

		return this;
	},

	/**
	 * Add a new button
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @return {Buttons} Self for chaining
	 */
	add: function ( config, idx )
	{
		var buttons = this.s.buttons;

		if ( typeof idx === 'string' ) {
			var split = idx.split('-');
			var base = this.s;

			for ( var i=0, ien=split.length-1 ; i<ien ; i++ ) {
				base = base.buttons[ split[i]*1 ];
			}

			buttons = base.buttons;
			idx = split[ split.length-1 ]*1;
		}

		this._expandButton( buttons, config, false, idx );
		this._draw();

		return this;
	},

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	container: function ()
	{
		return this.dom.container;
	},

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	disable: function ( node ) {
		var button = this._nodeToButton( node );

		$(button.node).addClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	destroy: function ()
	{
		// Key event listener
		$('body').off( 'keyup.'+this.s.namespace );

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;
		
		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.remove( buttons[i].node );
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for ( i=0, ien=buttonInsts.length ; i<ien ; i++ ) {
			if ( buttonInsts.inst === this ) {
				buttonInsts.splice( i, 1 );
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	enable: function ( node, flag )
	{
		if ( flag === false ) {
			return this.disable( node );
		}

		var button = this._nodeToButton( node );
		$(button.node).removeClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Get the instance name for the button set selector
	 * @return {string} Instance name
	 */
	name: function ()
	{
		return this.c.name;
	},

	/**
	 * Get a button's node
	 * @param  {node} node Button node
	 * @return {jQuery} Button element
	 */
	node: function ( node )
	{
		var button = this._nodeToButton( node );
		return $(button.node);
	},

	/**
	 * Set / get a processing class on the selected button
	 * @param  {boolean} flag true to add, false to remove, undefined to get
	 * @return {boolean|Buttons} Getter value or this if a setter.
	 */
	processing: function ( node, flag )
	{
		var button = this._nodeToButton( node );

		if ( flag === undefined ) {
			return $(button.node).hasClass( 'processing' );
		}

		$(button.node).toggleClass( 'processing', flag );

		return this;
	},

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	remove: function ( node )
	{
		var button = this._nodeToButton( node );
		var host = this._nodeToHost( node );
		var dt = this.s.dt;

		// Remove any child buttons first
		if ( button.buttons.length ) {
			for ( var i=button.buttons.length-1 ; i>=0 ; i-- ) {
				this.remove( button.buttons[i].node );
			}
		}

		// Allow the button to remove event handlers, etc
		if ( button.conf.destroy ) {
			button.conf.destroy.call( dt.button(node), dt, $(node), button.conf );
		}

		this._removeKey( button.conf );

		$(button.node).remove();

		var idx = $.inArray( button, host );
		host.splice( idx, 1 );

		return this;
	},

	/**
	 * Get the text for a button
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 *//**
	 * Set the text for a button
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 */
	text: function ( node, label )
	{
		var button = this._nodeToButton( node );
		var buttonLiner = this.c.dom.collection.buttonLiner;
		var linerTag = button.inCollection && buttonLiner && buttonLiner.tag ?
			buttonLiner.tag :
			this.c.dom.buttonLiner.tag;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, jqNode, button.conf ) :
				opt;
		};

		if ( label === undefined ) {
			return text( button.conf.text );
		}

		button.conf.text = label;

		if ( linerTag ) {
			jqNode.children( linerTag ).html( text(label) );
		}
		else {
			jqNode.html( text(label) );
		}

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons =  this.c.buttons;

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.add( buttons[i] );
		}

		dt.on( 'destroy', function () {
			that.destroy();
		} );

		// Global key event binding to listen for button keys
		$('body').on( 'keyup.'+this.s.namespace, function ( e ) {
			if ( ! document.activeElement || document.activeElement === document.body ) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if ( that.s.listenKeys.toLowerCase().indexOf( character ) !== -1 ) {
					that._keypress( character, e );
				}
			}
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param {object} conf Resolved button configuration object
	 * @private
	 */
	_addKey: function ( conf )
	{
		if ( conf.key ) {
			this.s.listenKeys += $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 * @private
	 */
	_draw: function ( container, buttons )
	{
		if ( ! container ) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			container.append( buttons[i].inserter );
			container.append( ' ' );

			if ( buttons[i].buttons && buttons[i].buttons.length ) {
				this._draw( buttons[i].collection, buttons[i].buttons );
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 * @private
	 */
	_expandButton: function ( attachTo, button, inCollection, attachPoint )
	{
		var dt = this.s.dt;
		var buttonCounter = 0;
		var buttons = ! $.isArray( button ) ?
			[ button ] :
			button;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = this._resolveExtends( buttons[i] );

			if ( ! conf ) {
				continue;
			}

			// If the configuration is an array, then expand the buttons at this
			// point
			if ( $.isArray( conf ) ) {
				this._expandButton( attachTo, conf, inCollection, attachPoint );
				continue;
			}

			var built = this._buildButton( conf, inCollection );
			if ( ! built ) {
				continue;
			}

			if ( attachPoint !== undefined ) {
				attachTo.splice( attachPoint, 0, built );
				attachPoint++;
			}
			else {
				attachTo.push( built );
			}

			if ( built.conf.buttons ) {
				var collectionDom = this.c.dom.collection;
				built.collection = $('<'+collectionDom.tag+'/>')
					.addClass( collectionDom.className )
					.attr( 'role', 'menu') ;
				built.conf._collection = built.collection;

				this._expandButton( built.buttons, built.conf.buttons, true, attachPoint );
			}

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if ( conf.init ) {
				conf.init.call( dt.button( built.node ), dt, $(built.node), conf );
			}

			buttonCounter++;
		}
	},

	/**
	 * Create an individual button
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {jQuery} Created button node (jQuery)
	 * @private
	 */
	_buildButton: function ( config, inCollection )
	{
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;
		var collectionDom = this.c.dom.collection;
		var dt = this.s.dt;
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, button, config ) :
				opt;
		};

		if ( inCollection && collectionDom.button ) {
			buttonDom = collectionDom.button;
		}

		if ( inCollection && collectionDom.buttonLiner ) {
			linerDom = collectionDom.buttonLiner;
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, Flash buttons require Flash
		if ( config.available && ! config.available( dt, config ) ) {
			return false;
		}

		var action = function ( e, dt, button, config ) {
			config.action.call( dt.button( button ), e, dt, button, config );

			$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
				dt.button( button ), dt, button, config 
			] );
		};

		var button = $('<'+buttonDom.tag+'/>')
			.addClass( buttonDom.className )
			.attr( 'tabindex', this.s.dt.settings()[0].iTabIndex )
			.attr( 'aria-controls', this.s.dt.table().node().id )
			.on( 'click.dtb', function (e) {
				e.preventDefault();

				if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
					action( e, dt, button, config );
				}

				button.blur();
			} )
			.on( 'keyup.dtb', function (e) {
				if ( e.keyCode === 13 ) {
					if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
						action( e, dt, button, config );
					}
				}
			} );

		// Make `a` tags act like a link
		if ( buttonDom.tag.toLowerCase() === 'a' ) {
			button.attr( 'href', '#' );
		}

		if ( linerDom.tag ) {
			var liner = $('<'+linerDom.tag+'/>')
				.html( text( config.text ) )
				.addClass( linerDom.className );

			if ( linerDom.tag.toLowerCase() === 'a' ) {
				liner.attr( 'href', '#' );
			}

			button.append( liner );
		}
		else {
			button.html( text( config.text ) );
		}

		if ( config.enabled === false ) {
			button.addClass( buttonDom.disabled );
		}

		if ( config.className ) {
			button.addClass( config.className );
		}

		if ( config.titleAttr ) {
			button.attr( 'title', text( config.titleAttr ) );
		}

		if ( config.attr ) {
			button.attr( config.attr );
		}

		if ( ! config.namespace ) {
			config.namespace = '.dt-button-'+(_buttonCounter++);
		}

		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if ( buttonContainer && buttonContainer.tag ) {
			inserter = $('<'+buttonContainer.tag+'/>')
				.addClass( buttonContainer.className )
				.append( button );
		}
		else {
			inserter = button;
		}

		this._addKey( config );

		return {
			conf:         config,
			node:         button.get(0),
			inserter:     inserter,
			buttons:      [],
			inCollection: inCollection,
			collection:   null
		};
	},

	/**
	 * Get the button object from a node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {object} Button object
	 * @private
	 */
	_nodeToButton: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons[i];
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToButton( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Get container array for a button from a button node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {array} Button's host array
	 * @private
	 */
	_nodeToHost: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons;
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToHost( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 * @param  {string} character The character pressed
	 * @param  {object} e Key event that triggered this call
	 * @private
	 */
	_keypress: function ( character, e )
	{
		// Check if this button press already activated on another instance of Buttons
		if ( e._buttonsHandled ) {
			return;
		}

		var run = function ( conf, node ) {
			if ( ! conf.key ) {
				return;
			}

			if ( conf.key === character ) {
				e._buttonsHandled = true;
				$(node).click();
			}
			else if ( $.isPlainObject( conf.key ) ) {
				if ( conf.key.key !== character ) {
					return;
				}

				if ( conf.key.shiftKey && ! e.shiftKey ) {
					return;
				}

				if ( conf.key.altKey && ! e.altKey ) {
					return;
				}

				if ( conf.key.ctrlKey && ! e.ctrlKey ) {
					return;
				}

				if ( conf.key.metaKey && ! e.metaKey ) {
					return;
				}

				// Made it this far - it is good
				e._buttonsHandled = true;
				$(node).click();
			}
		};

		var recurse = function ( a ) {
			for ( var i=0, ien=a.length ; i<ien ; i++ ) {
				run( a[i].conf, a[i].node );

				if ( a[i].buttons.length ) {
					recurse( a[i].buttons );
				}
			}
		};

		recurse( this.s.buttons );
	},

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 * @param  {object} conf Button configuration
	 * @private
	 */
	_removeKey: function ( conf )
	{
		if ( conf.key ) {
			var character = $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = $.inArray( character, a );
			a.splice( idx, 1 );
			this.s.listenKeys = a.join('');
		}
	},

	/**
	 * Resolve a button configuration
	 * @param  {string|function|object} conf Button config to resolve
	 * @return {object} Button configuration
	 * @private
	 */
	_resolveExtends: function ( conf )
	{
		var dt = this.s.dt;
		var i, ien;
		var toConfObject = function ( base ) {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while ( ! $.isPlainObject(base) && ! $.isArray(base) ) {
				if ( base === undefined ) {
					return;
				}

				if ( typeof base === 'function' ) {
					base = base( dt, conf );

					if ( ! base ) {
						return false;
					}
				}
				else if ( typeof base === 'string' ) {
					if ( ! _dtButtons[ base ] ) {
						throw 'Unknown button type: '+base;
					}

					base = _dtButtons[ base ];
				}

				loop++;
				if ( loop > 30 ) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return $.isArray( base ) ?
				base :
				$.extend( {}, base );
		};

		conf = toConfObject( conf );

		while ( conf && conf.extend ) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if ( ! _dtButtons[ conf.extend ] ) {
				throw 'Cannot extend unknown button type: '+conf.extend;
			}

			var objArray = toConfObject( _dtButtons[ conf.extend ] );
			if ( $.isArray( objArray ) ) {
				return objArray;
			}
			else if ( ! objArray ) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			conf = $.extend( {}, objArray, conf );

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if ( originalClassName && conf.className !== originalClassName ) {
				conf.className = originalClassName+' '+conf.className;
			}

			// Buttons to be added to a collection  -gives the ability to define
			// if buttons should be added to the start or end of a collection
			var postfixButtons = conf.postfixButtons;
			if ( postfixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=postfixButtons.length ; i<ien ; i++ ) {
					conf.buttons.push( postfixButtons[i] );
				}

				conf.postfixButtons = null;
			}

			var prefixButtons = conf.prefixButtons;
			if ( prefixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=prefixButtons.length ; i<ien ; i++ ) {
					conf.buttons.splice( i, 0, prefixButtons[i] );
				}

				conf.prefixButtons = null;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		return conf;
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden 
 * @param  {string} Class to assign to the background
 * @static
 */
Buttons.background = function ( show, className, fade ) {
	if ( fade === undefined ) {
		fade = 400;
	}

	if ( show ) {
		$('<div/>')
			.addClass( className )
			.css( 'display', 'none' )
			.appendTo( 'body' )
			.fadeIn( fade );
	}
	else {
		$('body > div.'+className)
			.fadeOut( fade, function () {
				$(this)
					.removeClass( className )
					.remove();
			} );
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 * @static
 */
Buttons.instanceSelector = function ( group, buttons )
{
	if ( ! group ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( $.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== -1 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( $.trim(input), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
	};
	
	process( group );

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 * @static
 */
Buttons.buttonSelector = function ( insts, selector )
{
	var ret = [];
	var nodeBuilder = function ( a, buttons, baseIdx ) {
		var button;
		var idx;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( button ) {
				idx = baseIdx !== undefined ?
					baseIdx+i :
					i+'';

				a.push( {
					node: button.node,
					name: button.conf.name,
					idx:  idx
				} );

				if ( button.buttons ) {
					nodeBuilder( a, button.buttons, idx+'-' );
				}
			}
		}
	};

	var run = function ( selector, inst ) {
		var i, ien;
		var buttons = [];
		nodeBuilder( buttons, inst.s.buttons );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( $.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( selector === null || selector === undefined || selector === '*' ) {
			// Select all
			for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
				ret.push( {
					inst: inst,
					node: buttons[i].node
				} );
			}
		}
		else if ( typeof selector === 'number' ) {
			// Main button index selector
			ret.push( {
				inst: inst,
				node: inst.s.buttons[ selector ].node
			} );
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( $.trim(a[i]), inst );
				}
			}
			else if ( selector.match( /^\d+(\-\d+)*$/ ) ) {
				// Sub-button index selector
				var indexes = $.map( buttons, function (v) {
					return v.idx;
				} );

				ret.push( {
					inst: inst,
					node: buttons[ $.inArray( selector, indexes ) ].node
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							node: buttons[i].node
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						node: this
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					node: nodes[ idx ]
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
};


/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site.
 * @type {Object}
 * @static
 */
Buttons.defaults = {
	buttons: [ 'copy', 'excel', 'csv', 'pdf', 'print' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: 'dt-button-collection'
		},
		button: {
			tag: 'button',
			className: 'dt-button',
			active: 'active',
			disabled: 'disabled'
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		}
	}
};

/**
 * Version information
 * @type {string}
 * @static
 */
Buttons.version = '1.5.1';


$.extend( _dtButtons, {
	collection: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.collection', 'Collection' );
		},
		className: 'buttons-collection',
		action: function ( e, dt, button, config ) {
			var host = button;
			var collectionParent = $(button).parents('div.dt-button-collection');
			var hostPosition = host.position();
			var tableContainer = $( dt.table().container() );
			var multiLevel = false;
			var insertPoint = host;

			// Remove any old collection
			if ( collectionParent.length ) {
				multiLevel = $('.dt-button-collection').position();
				insertPoint = collectionParent;
				$('body').trigger( 'click.dtb-collection' );
			}

			config._collection
				.addClass( config.collectionLayout )
				.css( 'display', 'none' )
				.insertAfter( insertPoint )
				.fadeIn( config.fade );
			

			var position = config._collection.css( 'position' );

			if ( multiLevel && position === 'absolute' ) {
				config._collection.css( {
					top: multiLevel.top,
					left: multiLevel.left
				} );
			}
			else if ( position === 'absolute' ) {
				config._collection.css( {
					top: hostPosition.top + host.outerHeight(),
					left: hostPosition.left
				} );

				// calculate overflow when positioned beneath
				var tableBottom = tableContainer.offset().top + tableContainer.height();
				var listBottom = hostPosition.top + host.outerHeight() + config._collection.outerHeight();
				var bottomOverflow = listBottom - tableBottom;
				
				// calculate overflow when positioned above
				var listTop = hostPosition.top - config._collection.outerHeight();
				var tableTop = tableContainer.offset().top;
				var topOverflow = tableTop - listTop;
				
				// if bottom overflow is larger, move to the top because it fits better
				if (bottomOverflow > topOverflow) {
					config._collection.css( 'top', hostPosition.top - config._collection.outerHeight() - 5);
				}

				var listRight = hostPosition.left + config._collection.outerWidth();
				var tableRight = tableContainer.offset().left + tableContainer.width();
				if ( listRight > tableRight ) {
					config._collection.css( 'left', hostPosition.left - ( listRight - tableRight ) );
				}
			}
			else {
				// Fix position - centre on screen
				var top = config._collection.height() / 2;
				if ( top > $(window).height() / 2 ) {
					top = $(window).height() / 2;
				}

				config._collection.css( 'marginTop', top*-1 );
			}

			if ( config.background ) {
				Buttons.background( true, config.backgroundClassName, config.fade );
			}

			// Need to break the 'thread' for the collection button being
			// activated by a click - it would also trigger this event
			setTimeout( function () {
				// This is bonkers, but if we don't have a click listener on the
				// background element, iOS Safari will ignore the body click
				// listener below. An empty function here is all that is
				// required to make it work...
				$('div.dt-button-background').on( 'click.dtb-collection', function () {} );

				$('body').on( 'click.dtb-collection', function (e) {
					// andSelf is deprecated in jQ1.8, but we want 1.7 compat
					var back = $.fn.addBack ? 'addBack' : 'andSelf';

					if ( ! $(e.target).parents()[back]().filter( config._collection ).length ) {
						config._collection
							.fadeOut( config.fade, function () {
								config._collection.detach();
							} );

						$('div.dt-button-background').off( 'click.dtb-collection' );
						Buttons.background( false, config.backgroundClassName, config.fade );

						$('body').off( 'click.dtb-collection' );
						dt.off( 'buttons-action.b-internal' );
					}
				} );
			}, 10 );

			if ( config.autoClose ) {
				dt.on( 'buttons-action.b-internal', function () {
					$('div.dt-button-background').click();
				} );
			}
		},
		background: true,
		collectionLayout: '',
		backgroundClassName: 'dt-button-background',
		autoClose: false,
		fade: 400,
		attr: {
			'aria-haspopup': true
		}
	},
	copy: function ( dt, conf ) {
		if ( _dtButtons.copyHtml5 ) {
			return 'copyHtml5';
		}
		if ( _dtButtons.copyFlash && _dtButtons.copyFlash.available( dt, conf ) ) {
			return 'copyFlash';
		}
	},
	csv: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.csvHtml5 && _dtButtons.csvHtml5.available( dt, conf ) ) {
			return 'csvHtml5';
		}
		if ( _dtButtons.csvFlash && _dtButtons.csvFlash.available( dt, conf ) ) {
			return 'csvFlash';
		}
	},
	excel: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.excelHtml5 && _dtButtons.excelHtml5.available( dt, conf ) ) {
			return 'excelHtml5';
		}
		if ( _dtButtons.excelFlash && _dtButtons.excelFlash.available( dt, conf ) ) {
			return 'excelFlash';
		}
	},
	pdf: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available( dt, conf ) ) {
			return 'pdfHtml5';
		}
		if ( _dtButtons.pdfFlash && _dtButtons.pdfFlash.available( dt, conf ) ) {
			return 'pdfFlash';
		}
	},
	pageLength: function ( dt ) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = $.isArray( lengthMenu[0] ) ? lengthMenu[0] : lengthMenu;
		var lang = $.isArray( lengthMenu[0] ) ? lengthMenu[1] : lengthMenu;
		var text = function ( dt ) {
			return dt.i18n( 'buttons.pageLength', {
				"-1": 'Show all rows',
				_:    'Show %d rows'
			}, dt.page.len() );
		};

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map( vals, function ( val, i ) {
				return {
					text: lang[i],
					className: 'button-page-length',
					action: function ( e, dt ) {
						dt.page.len( val ).draw();
					},
					init: function ( dt, node, conf ) {
						var that = this;
						var fn = function () {
							that.active( dt.page.len() === val );
						};

						dt.on( 'length.dt'+conf.namespace, fn );
						fn();
					},
					destroy: function ( dt, node, conf ) {
						dt.off( 'length.dt'+conf.namespace );
					}
				};
			} ),
			init: function ( dt, node, conf ) {
				var that = this;
				dt.on( 'length.dt'+conf.namespace, function () {
					that.text( text( dt ) );
				} );
			},
			destroy: function ( dt, node, conf ) {
				dt.off( 'length.dt'+conf.namespace );
			}
		};
	}
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			return Buttons.buttonSelector(
				Buttons.instanceSelector( group, ctx._buttons ),
				selector
			);
		}
	}, true );

	res._groupSelector = group;
	return res;
} );

// Individual button selector
DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

// Active buttons
DataTable.Api.registerPlural( 'buttons().active()', 'button().active()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.active( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.active( set.node, flag );
	} );
} );

// Get / set button action
DataTable.Api.registerPlural( 'buttons().action()', 'button().action()', function ( action ) {
	if ( action === undefined ) {
		return this.map( function ( set ) {
			return set.inst.action( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.action( set.node, action );
	} );
} );

// Enable / disable buttons
DataTable.Api.register( ['buttons().enable()', 'button().enable()'], function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.node, flag );
	} );
} );

// Disable buttons
DataTable.Api.register( ['buttons().disable()', 'button().disable()'], function () {
	return this.each( function ( set ) {
		set.inst.disable( set.node );
	} );
} );

// Get button nodes
DataTable.Api.registerPlural( 'buttons().nodes()', 'button().node()', function () {
	var jq = $();

	// jQuery will automatically reduce duplicates to a single entry
	$( this.each( function ( set ) {
		jq = jq.add( set.inst.node( set.node ) );
	} ) );

	return jq;
} );

// Get / set button processing state
DataTable.Api.registerPlural( 'buttons().processing()', 'button().processing()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.processing( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.processing( set.node, flag );
	} );
} );

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural( 'buttons().text()', 'button().text()', function ( label ) {
	if ( label === undefined ) {
		return this.map( function ( set ) {
			return set.inst.text( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.text( set.node, label );
	} );
} );

// Trigger a button's action
DataTable.Api.registerPlural( 'buttons().trigger()', 'button().trigger()', function () {
	return this.each( function ( set ) {
		set.inst.node( set.node ).trigger( 'click' );
	} );
} );

// Get the container elements
DataTable.Api.registerPlural( 'buttons().containers()', 'buttons().container()', function () {
	var jq = $();
	var groupSelector = this._groupSelector;

	// We need to use the group selector directly, since if there are no buttons
	// the result set will be empty
	this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			var insts = Buttons.instanceSelector( groupSelector, ctx._buttons );

			for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
				jq = jq.add( insts[i].container() );
			}
		}
	} );

	return jq;
} );

// Add a new button
DataTable.Api.register( 'button().add()', function ( idx, conf ) {
	var ctx = this.context;

	// Don't use `this` as it could be empty - select the instances directly
	if ( ctx.length ) {
		var inst = Buttons.instanceSelector( this._groupSelector, ctx[0]._buttons );

		if ( inst.length ) {
			inst[0].add( conf, idx );
		}
	}

	return this.button( this._groupSelector, idx );
} );

// Destroy the button sets selected
DataTable.Api.register( 'buttons().destroy()', function () {
	this.pluck( 'inst' ).unique().each( function ( inst ) {
		inst.destroy();
	} );

	return this;
} );

// Remove a button
DataTable.Api.registerPlural( 'buttons().remove()', 'buttons().remove()', function () {
	this.each( function ( set ) {
		set.inst.remove( set.node );
	} );

	return this;
} );

// Information box that can be used by buttons
var _infoTimer;
DataTable.Api.register( 'buttons.info()', function ( title, message, time ) {
	var that = this;

	if ( title === false ) {
		$('#datatables_buttons_info').fadeOut( function () {
			$(this).remove();
		} );
		clearTimeout( _infoTimer );
		_infoTimer = null;

		return this;
	}

	if ( _infoTimer ) {
		clearTimeout( _infoTimer );
	}

	if ( $('#datatables_buttons_info').length ) {
		$('#datatables_buttons_info').remove();
	}

	title = title ? '<h2>'+title+'</h2>' : '';

	$('<div id="datatables_buttons_info" class="dt-button-info"/>')
		.html( title )
		.append( $('<div/>')[ typeof message === 'string' ? 'html' : 'append' ]( message ) )
		.css( 'display', 'none' )
		.appendTo( 'body' )
		.fadeIn();

	if ( time !== undefined && time !== 0 ) {
		_infoTimer = setTimeout( function () {
			that.buttons.info( false );
		}, time );
	}

	return this;
} );

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register( 'buttons.exportData()', function ( options ) {
	if ( this.context.length ) {
		return _exportData( new DataTable.Api( this.context[0] ), options );
	}
} );

// Get information about the export that is common to many of the export data
// types (DRY)
DataTable.Api.register( 'buttons.exportInfo()', function ( conf ) {
	if ( ! conf ) {
		conf = {};
	}

	return {
		filename: _filename( conf ),
		title: _title( conf ),
		messageTop: _message(this, conf.message || conf.messageTop, 'top'),
		messageBottom: _message(this, conf.messageBottom, 'bottom')
	};
} );



/**
 * Get the file name for an exported file.
 *
 * @param {object}	config Button configuration
 * @param {boolean} incExtension Include the file name extension
 */
var _filename = function ( config )
{
	// Backwards compatibility
	var filename = config.filename === '*' && config.title !== '*' && config.title !== undefined && config.title !== null && config.title !== '' ?
		config.title :
		config.filename;

	if ( typeof filename === 'function' ) {
		filename = filename();
	}

	if ( filename === undefined || filename === null ) {
		return null;
	}

	if ( filename.indexOf( '*' ) !== -1 ) {
		filename = $.trim( filename.replace( '*', $('head > title').text() ) );
	}

	// Strip characters which the OS will object to
	filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

	var extension = _stringOrFunction( config.extension );
	if ( ! extension ) {
		extension = '';
	}

	return filename + extension;
};

/**
 * Simply utility method to allow parameters to be given as a function
 *
 * @param {undefined|string|function} option Option
 * @return {null|string} Resolved value
 */
var _stringOrFunction = function ( option )
{
	if ( option === null || option === undefined ) {
		return null;
	}
	else if ( typeof option === 'function' ) {
		return option();
	}
	return option;
};

/**
 * Get the title for an exported file.
 *
 * @param {object} config	Button configuration
 */
var _title = function ( config )
{
	var title = _stringOrFunction( config.title );

	return title === null ?
		null : title.indexOf( '*' ) !== -1 ?
			title.replace( '*', $('head > title').text() || 'Exported data' ) :
			title;
};

var _message = function ( dt, option, position )
{
	var message = _stringOrFunction( option );
	if ( message === null ) {
		return null;
	}

	var caption = $('caption', dt.table().container()).eq(0);
	if ( message === '*' ) {
		var side = caption.css( 'caption-side' );
		if ( side !== position ) {
			return null;
		}

		return caption.length ?
			caption.text() :
			'';
	}

	return message;
};







var _exportTextarea = $('<textarea/>')[0];
var _exportData = function ( dt, inOpts )
{
	var config = $.extend( true, {}, {
		rows:           null,
		columns:        '',
		modifier:       {
			search: 'applied',
			order:  'applied'
		},
		orthogonal:     'display',
		stripHtml:      true,
		stripNewlines:  true,
		decodeEntities: true,
		trim:           true,
		format:         {
			header: function ( d ) {
				return strip( d );
			},
			footer: function ( d ) {
				return strip( d );
			},
			body: function ( d ) {
				return strip( d );
			}
		}
	}, inOpts );

	var strip = function ( str ) {
		if ( typeof str !== 'string' ) {
			return str;
		}

		// Always remove script tags
		str = str.replace( /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '' );

		if ( config.stripHtml ) {
			str = str.replace( /<[^>]*>/g, '' );
		}

		if ( config.trim ) {
			str = str.replace( /^\s+|\s+$/g, '' );
		}

		if ( config.stripNewlines ) {
			str = str.replace( /\n/g, ' ' );
		}

		if ( config.decodeEntities ) {
			_exportTextarea.innerHTML = str;
			str = _exportTextarea.value;
		}

		return str;
	};


	var header = dt.columns( config.columns ).indexes().map( function (idx) {
		var el = dt.column( idx ).header();
		return config.format.header( el.innerHTML, idx, el );
	} ).toArray();

	var footer = dt.table().footer() ?
		dt.columns( config.columns ).indexes().map( function (idx) {
			var el = dt.column( idx ).footer();
			return config.format.footer( el ? el.innerHTML : '', idx, el );
		} ).toArray() :
		null;
	
	// If Select is available on this table, and any rows are selected, limit the export
	// to the selected rows. If no rows are selected, all rows will be exported. Specify
	// a `selected` modifier to control directly.
	var modifier = $.extend( {}, config.modifier );
	if ( dt.select && typeof dt.select.info === 'function' && modifier.selected === undefined ) {
		if ( dt.rows( config.rows, $.extend( { selected: true }, modifier ) ).any() ) {
			$.extend( modifier, { selected: true } )
		}
	}

	var rowIndexes = dt.rows( config.rows, modifier ).indexes().toArray();
	var selectedCells = dt.cells( rowIndexes, config.columns );
	var cells = selectedCells
		.render( config.orthogonal )
		.toArray();
	var cellNodes = selectedCells
		.nodes()
		.toArray();

	var columns = header.length;
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = [ rows ];
	var cellCounter = 0;

	for ( var i=0, ien=rows ; i<ien ; i++ ) {
		var row = [ columns ];

		for ( var j=0 ; j<columns ; j++ ) {
			row[j] = config.format.body( cells[ cellCounter ], i, j, cellNodes[ cellCounter ] );
			cellCounter++;
		}

		body[i] = row;
	}

	return {
		header: header,
		footer: footer,
		body:   body
	};
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;



// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API. Listen for `init` for compatibility with pre 1.10.10, but to
// be removed in future.
$(document).on( 'init.dt plugin-init.dt', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var opts = settings.oInit.buttons || DataTable.defaults.buttons;

	if ( opts && ! settings._buttons ) {
		new Buttons( settings, opts ).container();
	}
} );

// DataTables `dom` feature option
DataTable.ext.feature.push( {
	fnInit: function( settings ) {
		var api = new DataTable.Api( settings );
		var opts = api.init().buttons || DataTable.defaults.buttons;

		return new Buttons( api, opts ).container();
	},
	cFeature: "B"
} );


return Buttons;
}));


/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons btn-group'
		},
		button: {
			className: 'btn btn-default'
		},
		collection: {
			tag: 'ul',
			className: 'dt-button-collection dropdown-menu',
			button: {
				tag: 'li',
				className: 'dt-button',
				active: 'active',
				disabled: 'disabled'
			},
			buttonLiner: {
				tag: 'a',
				className: ''
			}
		}
	}
} );

DataTable.ext.buttons.collection.text = function ( dt ) {
	return dt.i18n('buttons.collection', 'Collection <span class="caret"/>');
};


return DataTable.Buttons;
}));


/*!
 * Print button for Buttons and DataTables.
 * 2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


var _link = document.createElement( 'a' );

/**
 * Clone link and style tags, taking into account the need to change the source
 * path.
 *
 * @param  {node}     el Element to convert
 */
var _styleToAbs = function( el ) {
	var url;
	var clone = $(el).clone()[0];
	var linkHost;

	if ( clone.nodeName.toLowerCase() === 'link' ) {
		clone.href = _relToAbs( clone.href );
	}

	return clone.outerHTML;
};

/**
 * Convert a URL from a relative to an absolute address so it will work
 * correctly in the popup window which has no base URL.
 *
 * @param  {string} href URL
 */
var _relToAbs = function( href ) {
	// Assign to a link on the original page so the browser will do all the
	// hard work of figuring out where the file actually is
	_link.href = href;
	var linkHost = _link.host;

	// IE doesn't have a trailing slash on the host
	// Chrome has it on the pathname
	if ( linkHost.indexOf('/') === -1 && _link.pathname.indexOf('/') !== 0) {
		linkHost += '/';
	}

	return _link.protocol+"//"+linkHost+_link.pathname+_link.search;
};


DataTable.ext.buttons.print = {
	className: 'buttons-print',

	text: function ( dt ) {
		return dt.i18n( 'buttons.print', 'Print' );
	},

	action: function ( e, dt, button, config ) {
		var data = dt.buttons.exportData(
			$.extend( {decodeEntities: false}, config.exportOptions ) // XSS protection
		);
		var exportInfo = dt.buttons.exportInfo( config );

		var addRow = function ( d, tag ) {
			var str = '<tr>';

			for ( var i=0, ien=d.length ; i<ien ; i++ ) {
				str += '<'+tag+'>'+d[i]+'</'+tag+'>';
			}

			return str + '</tr>';
		};

		// Construct a table for printing
		var html = '<table class="'+dt.table().node().className+'">';

		if ( config.header ) {
			html += '<thead>'+ addRow( data.header, 'th' ) +'</thead>';
		}

		html += '<tbody>';
		for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
			html += addRow( data.body[i], 'td' );
		}
		html += '</tbody>';

		if ( config.footer && data.footer ) {
			html += '<tfoot>'+ addRow( data.footer, 'th' ) +'</tfoot>';
		}
		html += '</table>';

		// Open a new window for the printable table
		var win = window.open( '', '' );
		win.document.close();

		// Inject the title and also a copy of the style and link tags from this
		// document so the table can retain its base styling. Note that we have
		// to use string manipulation as IE won't allow elements to be created
		// in the host document and then appended to the new window.
		var head = '<title>'+exportInfo.title+'</title>';
		$('style, link').each( function () {
			head += _styleToAbs( this );
		} );

		try {
			win.document.head.innerHTML = head; // Work around for Edge
		}
		catch (e) {
			$(win.document.head).html( head ); // Old IE
		}

		// Inject the table and other surrounding information
		win.document.body.innerHTML =
			'<h1>'+exportInfo.title+'</h1>'+
			'<div>'+(exportInfo.messageTop || '')+'</div>'+
			html+
			'<div>'+(exportInfo.messageBottom || '')+'</div>';

		$(win.document.body).addClass('dt-print-view');

		$('img', win.document.body).each( function ( i, img ) {
			img.setAttribute( 'src', _relToAbs( img.getAttribute('src') ) );
		} );

		if ( config.customize ) {
			config.customize( win );
		}

		// Allow stylesheets time to load
		setTimeout( function () {
			if ( config.autoPrint ) {
				win.print(); // blocking - so close will not
				win.close(); // execute until this is done
			}
		}, 1000 );
	},

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	exportOptions: {},

	header: true,

	footer: false,

	autoPrint: true,

	customize: null
};


return DataTable.Buttons;
}));


/*! ColReorder 1.4.1
 * ©2010-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     ColReorder
 * @description Provide the ability to reorder columns in a DataTable
 * @version     1.4.1
 * @file        dataTables.colReorder.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2010-2017 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/**
 * Switch the key value pairing of an index array to be value key (i.e. the old value is now the
 * key). For example consider [ 2, 0, 1 ] this would be returned as [ 1, 2, 0 ].
 *  @method  fnInvertKeyValues
 *  @param   array aIn Array to switch around
 *  @returns array
 */
function fnInvertKeyValues( aIn )
{
	var aRet=[];
	for ( var i=0, iLen=aIn.length ; i<iLen ; i++ )
	{
		aRet[ aIn[i] ] = i;
	}
	return aRet;
}


/**
 * Modify an array by switching the position of two elements
 *  @method  fnArraySwitch
 *  @param   array aArray Array to consider, will be modified by reference (i.e. no return)
 *  @param   int iFrom From point
 *  @param   int iTo Insert point
 *  @returns void
 */
function fnArraySwitch( aArray, iFrom, iTo )
{
	var mStore = aArray.splice( iFrom, 1 )[0];
	aArray.splice( iTo, 0, mStore );
}


/**
 * Switch the positions of nodes in a parent node (note this is specifically designed for
 * table rows). Note this function considers all element nodes under the parent!
 *  @method  fnDomSwitch
 *  @param   string sTag Tag to consider
 *  @param   int iFrom Element to move
 *  @param   int Point to element the element to (before this point), can be null for append
 *  @returns void
 */
function fnDomSwitch( nParent, iFrom, iTo )
{
	var anTags = [];
	for ( var i=0, iLen=nParent.childNodes.length ; i<iLen ; i++ )
	{
		if ( nParent.childNodes[i].nodeType == 1 )
		{
			anTags.push( nParent.childNodes[i] );
		}
	}
	var nStore = anTags[ iFrom ];

	if ( iTo !== null )
	{
		nParent.insertBefore( nStore, anTags[iTo] );
	}
	else
	{
		nParent.appendChild( nStore );
	}
}


/**
 * Plug-in for DataTables which will reorder the internal column structure by taking the column
 * from one position (iFrom) and insert it into a given point (iTo).
 *  @method  $.fn.dataTableExt.oApi.fnColReorder
 *  @param   object oSettings DataTables settings object - automatically added by DataTables!
 *  @param   int iFrom Take the column to be repositioned from this point
 *  @param   int iTo and insert it into this point
 *  @param   bool drop Indicate if the reorder is the final one (i.e. a drop)
 *    not a live reorder
 *  @param   bool invalidateRows speeds up processing if false passed
 *  @returns void
 */
$.fn.dataTableExt.oApi.fnColReorder = function ( oSettings, iFrom, iTo, drop, invalidateRows )
{
	var i, iLen, j, jLen, jen, iCols=oSettings.aoColumns.length, nTrs, oCol;
	var attrMap = function ( obj, prop, mapping ) {
		if ( ! obj[ prop ] || typeof obj[ prop ] === 'function' ) {
			return;
		}

		var a = obj[ prop ].split('.');
		var num = a.shift();

		if ( isNaN( num*1 ) ) {
			return;
		}

		obj[ prop ] = mapping[ num*1 ]+'.'+a.join('.');
	};

	/* Sanity check in the input */
	if ( iFrom == iTo )
	{
		/* Pointless reorder */
		return;
	}

	if ( iFrom < 0 || iFrom >= iCols )
	{
		this.oApi._fnLog( oSettings, 1, "ColReorder 'from' index is out of bounds: "+iFrom );
		return;
	}

	if ( iTo < 0 || iTo >= iCols )
	{
		this.oApi._fnLog( oSettings, 1, "ColReorder 'to' index is out of bounds: "+iTo );
		return;
	}

	/*
	 * Calculate the new column array index, so we have a mapping between the old and new
	 */
	var aiMapping = [];
	for ( i=0, iLen=iCols ; i<iLen ; i++ )
	{
		aiMapping[i] = i;
	}
	fnArraySwitch( aiMapping, iFrom, iTo );
	var aiInvertMapping = fnInvertKeyValues( aiMapping );


	/*
	 * Convert all internal indexing to the new column order indexes
	 */
	/* Sorting */
	for ( i=0, iLen=oSettings.aaSorting.length ; i<iLen ; i++ )
	{
		oSettings.aaSorting[i][0] = aiInvertMapping[ oSettings.aaSorting[i][0] ];
	}

	/* Fixed sorting */
	if ( oSettings.aaSortingFixed !== null )
	{
		for ( i=0, iLen=oSettings.aaSortingFixed.length ; i<iLen ; i++ )
		{
			oSettings.aaSortingFixed[i][0] = aiInvertMapping[ oSettings.aaSortingFixed[i][0] ];
		}
	}

	/* Data column sorting (the column which the sort for a given column should take place on) */
	for ( i=0, iLen=iCols ; i<iLen ; i++ )
	{
		oCol = oSettings.aoColumns[i];
		for ( j=0, jLen=oCol.aDataSort.length ; j<jLen ; j++ )
		{
			oCol.aDataSort[j] = aiInvertMapping[ oCol.aDataSort[j] ];
		}

		// Update the column indexes
		oCol.idx = aiInvertMapping[ oCol.idx ];
	}

	// Update 1.10 optimised sort class removal variable
	$.each( oSettings.aLastSort, function (i, val) {
		oSettings.aLastSort[i].src = aiInvertMapping[ val.src ];
	} );

	/* Update the Get and Set functions for each column */
	for ( i=0, iLen=iCols ; i<iLen ; i++ )
	{
		oCol = oSettings.aoColumns[i];

		if ( typeof oCol.mData == 'number' ) {
			oCol.mData = aiInvertMapping[ oCol.mData ];
		}
		else if ( $.isPlainObject( oCol.mData ) ) {
			// HTML5 data sourced
			attrMap( oCol.mData, '_',      aiInvertMapping );
			attrMap( oCol.mData, 'filter', aiInvertMapping );
			attrMap( oCol.mData, 'sort',   aiInvertMapping );
			attrMap( oCol.mData, 'type',   aiInvertMapping );
		}
	}

	/*
	 * Move the DOM elements
	 */
	if ( oSettings.aoColumns[iFrom].bVisible )
	{
		/* Calculate the current visible index and the point to insert the node before. The insert
		 * before needs to take into account that there might not be an element to insert before,
		 * in which case it will be null, and an appendChild should be used
		 */
		var iVisibleIndex = this.oApi._fnColumnIndexToVisible( oSettings, iFrom );
		var iInsertBeforeIndex = null;

		i = iTo < iFrom ? iTo : iTo + 1;
		while ( iInsertBeforeIndex === null && i < iCols )
		{
			iInsertBeforeIndex = this.oApi._fnColumnIndexToVisible( oSettings, i );
			i++;
		}

		/* Header */
		nTrs = oSettings.nTHead.getElementsByTagName('tr');
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			fnDomSwitch( nTrs[i], iVisibleIndex, iInsertBeforeIndex );
		}

		/* Footer */
		if ( oSettings.nTFoot !== null )
		{
			nTrs = oSettings.nTFoot.getElementsByTagName('tr');
			for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
			{
				fnDomSwitch( nTrs[i], iVisibleIndex, iInsertBeforeIndex );
			}
		}

		/* Body */
		for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
		{
			if ( oSettings.aoData[i].nTr !== null )
			{
				fnDomSwitch( oSettings.aoData[i].nTr, iVisibleIndex, iInsertBeforeIndex );
			}
		}
	}

	/*
	 * Move the internal array elements
	 */
	/* Columns */
	fnArraySwitch( oSettings.aoColumns, iFrom, iTo );

	// regenerate the get / set functions
	for ( i=0, iLen=iCols ; i<iLen ; i++ ) {
		oSettings.oApi._fnColumnOptions( oSettings, i, {} );
	}

	/* Search columns */
	fnArraySwitch( oSettings.aoPreSearchCols, iFrom, iTo );

	/* Array array - internal data anodes cache */
	for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
	{
		var data = oSettings.aoData[i];
		var cells = data.anCells;

		if ( cells ) {
			fnArraySwitch( cells, iFrom, iTo );

			// Longer term, should this be moved into the DataTables' invalidate
			// methods?
			for ( j=0, jen=cells.length ; j<jen ; j++ ) {
				if ( cells[j] && cells[j]._DT_CellIndex ) {
					cells[j]._DT_CellIndex.column = j;
				}
			}
		}

		// For DOM sourced data, the invalidate will reread the cell into
		// the data array, but for data sources as an array, they need to
		// be flipped
		if ( data.src !== 'dom' && $.isArray( data._aData ) ) {
			fnArraySwitch( data._aData, iFrom, iTo );
		}
	}

	/* Reposition the header elements in the header layout array */
	for ( i=0, iLen=oSettings.aoHeader.length ; i<iLen ; i++ )
	{
		fnArraySwitch( oSettings.aoHeader[i], iFrom, iTo );
	}

	if ( oSettings.aoFooter !== null )
	{
		for ( i=0, iLen=oSettings.aoFooter.length ; i<iLen ; i++ )
		{
			fnArraySwitch( oSettings.aoFooter[i], iFrom, iTo );
		}
	}

	if ( invalidateRows || invalidateRows === undefined )
	{
		$.fn.dataTable.Api( oSettings ).rows().invalidate();
	}

	/*
	 * Update DataTables' event handlers
	 */

	/* Sort listener */
	for ( i=0, iLen=iCols ; i<iLen ; i++ )
	{
		$(oSettings.aoColumns[i].nTh).off('click.DT');
		this.oApi._fnSortAttachListener( oSettings, oSettings.aoColumns[i].nTh, i );
	}


	/* Fire an event so other plug-ins can update */
	$(oSettings.oInstance).trigger( 'column-reorder.dt', [ oSettings, {
		from: iFrom,
		to: iTo,
		mapping: aiInvertMapping,
		drop: drop,

		// Old style parameters for compatibility
		iFrom: iFrom,
		iTo: iTo,
		aiInvertMapping: aiInvertMapping
	} ] );
};

/**
 * ColReorder provides column visibility control for DataTables
 * @class ColReorder
 * @constructor
 * @param {object} dt DataTables settings object
 * @param {object} opts ColReorder options
 */
var ColReorder = function( dt, opts )
{
	var settings = new $.fn.dataTable.Api( dt ).settings()[0];

	// Ensure that we can't initialise on the same table twice
	if ( settings._colReorder ) {
		return settings._colReorder;
	}

	// Allow the options to be a boolean for defaults
	if ( opts === true ) {
		opts = {};
	}

	// Convert from camelCase to Hungarian, just as DataTables does
	var camelToHungarian = $.fn.dataTable.camelToHungarian;
	if ( camelToHungarian ) {
		camelToHungarian( ColReorder.defaults, ColReorder.defaults, true );
		camelToHungarian( ColReorder.defaults, opts || {} );
	}


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public class variables
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	/**
	 * @namespace Settings object which contains customisable information for ColReorder instance
	 */
	this.s = {
		/**
		 * DataTables settings object
		 *  @property dt
		 *  @type     Object
		 *  @default  null
		 */
		"dt": null,

		/**
		 * Initialisation object used for this instance
		 *  @property init
		 *  @type     object
		 *  @default  {}
		 */
		"init": $.extend( true, {}, ColReorder.defaults, opts ),

		/**
		 * Number of columns to fix (not allow to be reordered)
		 *  @property fixed
		 *  @type     int
		 *  @default  0
		 */
		"fixed": 0,

		/**
		 * Number of columns to fix counting from right (not allow to be reordered)
		 *  @property fixedRight
		 *  @type     int
		 *  @default  0
		 */
		"fixedRight": 0,

		/**
		 * Callback function for once the reorder has been done
		 *  @property reorderCallback
		 *  @type     function
		 *  @default  null
		 */
		"reorderCallback": null,

		/**
		 * @namespace Information used for the mouse drag
		 */
		"mouse": {
			"startX": -1,
			"startY": -1,
			"offsetX": -1,
			"offsetY": -1,
			"target": -1,
			"targetIndex": -1,
			"fromIndex": -1
		},

		/**
		 * Information which is used for positioning the insert cusor and knowing where to do the
		 * insert. Array of objects with the properties:
		 *   x: x-axis position
		 *   to: insert point
		 *  @property aoTargets
		 *  @type     array
		 *  @default  []
		 */
		"aoTargets": []
	};


	/**
	 * @namespace Common and useful DOM elements for the class instance
	 */
	this.dom = {
		/**
		 * Dragging element (the one the mouse is moving)
		 *  @property drag
		 *  @type     element
		 *  @default  null
		 */
		"drag": null,

		/**
		 * The insert cursor
		 *  @property pointer
		 *  @type     element
		 *  @default  null
		 */
		"pointer": null
	};


	/* Constructor logic */
	this.s.dt = settings;
	this.s.dt._colReorder = this;
	this._fnConstruct();

	return this;
};



$.extend( ColReorder.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	/**
	 * Reset the column ordering to the original ordering that was detected on
	 * start up.
	 *  @return {this} Returns `this` for chaining.
	 *
	 *  @example
	 *    // DataTables initialisation with ColReorder
	 *    var table = $('#example').dataTable( {
	 *        "sDom": 'Rlfrtip'
	 *    } );
	 *
	 *    // Add click event to a button to reset the ordering
	 *    $('#resetOrdering').click( function (e) {
	 *        e.preventDefault();
	 *        $.fn.dataTable.ColReorder( table ).fnReset();
	 *    } );
	 */
	"fnReset": function ()
	{
		this._fnOrderColumns( this.fnOrder() );

		return this;
	},

	/**
	 * `Deprecated` - Get the current order of the columns, as an array.
	 *  @return {array} Array of column identifiers
	 *  @deprecated `fnOrder` should be used in preference to this method.
	 *      `fnOrder` acts as a getter/setter.
	 */
	"fnGetCurrentOrder": function ()
	{
		return this.fnOrder();
	},

	/**
	 * Get the current order of the columns, as an array. Note that the values
	 * given in the array are unique identifiers for each column. Currently
	 * these are the original ordering of the columns that was detected on
	 * start up, but this could potentially change in future.
	 *  @return {array} Array of column identifiers
	 *
	 *  @example
	 *    // Get column ordering for the table
	 *    var order = $.fn.dataTable.ColReorder( dataTable ).fnOrder();
	 *//**
	 * Set the order of the columns, from the positions identified in the
	 * ordering array given. Note that ColReorder takes a brute force approach
	 * to reordering, so it is possible multiple reordering events will occur
	 * before the final order is settled upon.
	 *  @param {array} [set] Array of column identifiers in the new order. Note
	 *    that every column must be included, uniquely, in this array.
	 *  @return {this} Returns `this` for chaining.
	 *
	 *  @example
	 *    // Swap the first and second columns
	 *    $.fn.dataTable.ColReorder( dataTable ).fnOrder( [1, 0, 2, 3, 4] );
	 *
	 *  @example
	 *    // Move the first column to the end for the table `#example`
	 *    var curr = $.fn.dataTable.ColReorder( '#example' ).fnOrder();
	 *    var first = curr.shift();
	 *    curr.push( first );
	 *    $.fn.dataTable.ColReorder( '#example' ).fnOrder( curr );
	 *
	 *  @example
	 *    // Reverse the table's order
	 *    $.fn.dataTable.ColReorder( '#example' ).fnOrder(
	 *      $.fn.dataTable.ColReorder( '#example' ).fnOrder().reverse()
	 *    );
	 */
	"fnOrder": function ( set, original )
	{
		var a = [], i, ien, j, jen;
		var columns = this.s.dt.aoColumns;

		if ( set === undefined ){
			for ( i=0, ien=columns.length ; i<ien ; i++ ) {
				a.push( columns[i]._ColReorder_iOrigCol );
			}

			return a;
		}

		// The order given is based on the original indexes, rather than the
		// existing ones, so we need to translate from the original to current
		// before then doing the order
		if ( original ) {
			var order = this.fnOrder();

			for ( i=0, ien=set.length ; i<ien ; i++ ) {
				a.push( $.inArray( set[i], order ) );
			}

			set = a;
		}

		this._fnOrderColumns( fnInvertKeyValues( set ) );

		return this;
	},


	/**
	 * Convert from the original column index, to the original
	 *
	 * @param  {int|array} idx Index(es) to convert
	 * @param  {string} dir Transpose direction - `fromOriginal` / `toCurrent`
	 *   or `'toOriginal` / `fromCurrent`
	 * @return {int|array}     Converted values
	 */
	fnTranspose: function ( idx, dir )
	{
		if ( ! dir ) {
			dir = 'toCurrent';
		}

		var order = this.fnOrder();
		var columns = this.s.dt.aoColumns;

		if ( dir === 'toCurrent' ) {
			// Given an original index, want the current
			return ! $.isArray( idx ) ?
				$.inArray( idx, order ) :
				$.map( idx, function ( index ) {
					return $.inArray( index, order );
				} );
		}
		else {
			// Given a current index, want the original
			return ! $.isArray( idx ) ?
				columns[idx]._ColReorder_iOrigCol :
				$.map( idx, function ( index ) {
					return columns[index]._ColReorder_iOrigCol;
				} );
		}
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods (they are of course public in JS, but recommended as private)
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	/**
	 * Constructor logic
	 *  @method  _fnConstruct
	 *  @returns void
	 *  @private
	 */
	"_fnConstruct": function ()
	{
		var that = this;
		var iLen = this.s.dt.aoColumns.length;
		var table = this.s.dt.nTable;
		var i;

		/* Columns discounted from reordering - counting left to right */
		if ( this.s.init.iFixedColumns )
		{
			this.s.fixed = this.s.init.iFixedColumns;
		}

		if ( this.s.init.iFixedColumnsLeft )
		{
			this.s.fixed = this.s.init.iFixedColumnsLeft;
		}

		/* Columns discounted from reordering - counting right to left */
		this.s.fixedRight = this.s.init.iFixedColumnsRight ?
			this.s.init.iFixedColumnsRight :
			0;

		/* Drop callback initialisation option */
		if ( this.s.init.fnReorderCallback )
		{
			this.s.reorderCallback = this.s.init.fnReorderCallback;
		}

		/* Add event handlers for the drag and drop, and also mark the original column order */
		for ( i = 0; i < iLen; i++ )
		{
			if ( i > this.s.fixed-1 && i < iLen - this.s.fixedRight )
			{
				this._fnMouseListener( i, this.s.dt.aoColumns[i].nTh );
			}

			/* Mark the original column order for later reference */
			this.s.dt.aoColumns[i]._ColReorder_iOrigCol = i;
		}

		/* State saving */
		this.s.dt.oApi._fnCallbackReg( this.s.dt, 'aoStateSaveParams', function (oS, oData) {
			that._fnStateSave.call( that, oData );
		}, "ColReorder_State" );

		/* An initial column order has been specified */
		var aiOrder = null;
		if ( this.s.init.aiOrder )
		{
			aiOrder = this.s.init.aiOrder.slice();
		}

		/* State loading, overrides the column order given */
		if ( this.s.dt.oLoadedState && typeof this.s.dt.oLoadedState.ColReorder != 'undefined' &&
		  this.s.dt.oLoadedState.ColReorder.length == this.s.dt.aoColumns.length )
		{
			aiOrder = this.s.dt.oLoadedState.ColReorder;
		}

		/* If we have an order to apply - do so */
		if ( aiOrder )
		{
			/* We might be called during or after the DataTables initialisation. If before, then we need
			 * to wait until the draw is done, if after, then do what we need to do right away
			 */
			if ( !that.s.dt._bInitComplete )
			{
				var bDone = false;
				$(table).on( 'draw.dt.colReorder', function () {
					if ( !that.s.dt._bInitComplete && !bDone )
					{
						bDone = true;
						var resort = fnInvertKeyValues( aiOrder );
						that._fnOrderColumns.call( that, resort );
					}
				} );
			}
			else
			{
				var resort = fnInvertKeyValues( aiOrder );
				that._fnOrderColumns.call( that, resort );
			}
		}
		else {
			this._fnSetColumnIndexes();
		}

		// Destroy clean up
		$(table).on( 'destroy.dt.colReorder', function () {
			$(table).off( 'destroy.dt.colReorder draw.dt.colReorder' );
			$(that.s.dt.nTHead).find( '*' ).off( '.ColReorder' );

			$.each( that.s.dt.aoColumns, function (i, column) {
				$(column.nTh).removeAttr('data-column-index');
			} );

			that.s.dt._colReorder = null;
			that.s = null;
		} );
	},


	/**
	 * Set the column order from an array
	 *  @method  _fnOrderColumns
	 *  @param   array a An array of integers which dictate the column order that should be applied
	 *  @returns void
	 *  @private
	 */
	"_fnOrderColumns": function ( a )
	{
		var changed = false;

		if ( a.length != this.s.dt.aoColumns.length )
		{
			this.s.dt.oInstance.oApi._fnLog( this.s.dt, 1, "ColReorder - array reorder does not "+
				"match known number of columns. Skipping." );
			return;
		}

		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			var currIndex = $.inArray( i, a );
			if ( i != currIndex )
			{
				/* Reorder our switching array */
				fnArraySwitch( a, currIndex, i );

				/* Do the column reorder in the table */
				this.s.dt.oInstance.fnColReorder( currIndex, i, true, false );

				changed = true;
			}
		}

		$.fn.dataTable.Api( this.s.dt ).rows().invalidate();

		this._fnSetColumnIndexes();

		// Has anything actually changed? If not, then nothing else to do
		if ( ! changed ) {
			return;
		}

		/* When scrolling we need to recalculate the column sizes to allow for the shift */
		if ( this.s.dt.oScroll.sX !== "" || this.s.dt.oScroll.sY !== "" )
		{
			this.s.dt.oInstance.fnAdjustColumnSizing( false );
		}

		/* Save the state */
		this.s.dt.oInstance.oApi._fnSaveState( this.s.dt );

		if ( this.s.reorderCallback !== null )
		{
			this.s.reorderCallback.call( this );
		}
	},


	/**
	 * Because we change the indexes of columns in the table, relative to their starting point
	 * we need to reorder the state columns to what they are at the starting point so we can
	 * then rearrange them again on state load!
	 *  @method  _fnStateSave
	 *  @param   object oState DataTables state
	 *  @returns string JSON encoded cookie string for DataTables
	 *  @private
	 */
	"_fnStateSave": function ( oState )
	{
		var i, iLen, aCopy, iOrigColumn;
		var oSettings = this.s.dt;
		var columns = oSettings.aoColumns;

		oState.ColReorder = [];

		/* Sorting */
		if ( oState.aaSorting ) {
			// 1.10.0-
			for ( i=0 ; i<oState.aaSorting.length ; i++ ) {
				oState.aaSorting[i][0] = columns[ oState.aaSorting[i][0] ]._ColReorder_iOrigCol;
			}

			var aSearchCopy = $.extend( true, [], oState.aoSearchCols );

			for ( i=0, iLen=columns.length ; i<iLen ; i++ )
			{
				iOrigColumn = columns[i]._ColReorder_iOrigCol;

				/* Column filter */
				oState.aoSearchCols[ iOrigColumn ] = aSearchCopy[i];

				/* Visibility */
				oState.abVisCols[ iOrigColumn ] = columns[i].bVisible;

				/* Column reordering */
				oState.ColReorder.push( iOrigColumn );
			}
		}
		else if ( oState.order ) {
			// 1.10.1+
			for ( i=0 ; i<oState.order.length ; i++ ) {
				oState.order[i][0] = columns[ oState.order[i][0] ]._ColReorder_iOrigCol;
			}

			var stateColumnsCopy = $.extend( true, [], oState.columns );

			for ( i=0, iLen=columns.length ; i<iLen ; i++ )
			{
				iOrigColumn = columns[i]._ColReorder_iOrigCol;

				/* Columns */
				oState.columns[ iOrigColumn ] = stateColumnsCopy[i];

				/* Column reordering */
				oState.ColReorder.push( iOrigColumn );
			}
		}
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Mouse drop and drag
	 */

	/**
	 * Add a mouse down listener to a particluar TH element
	 *  @method  _fnMouseListener
	 *  @param   int i Column index
	 *  @param   element nTh TH element clicked on
	 *  @returns void
	 *  @private
	 */
	"_fnMouseListener": function ( i, nTh )
	{
		var that = this;
		$(nTh)
			.on( 'mousedown.ColReorder', function (e) {
				that._fnMouseDown.call( that, e, nTh );
			} )
			.on( 'touchstart.ColReorder', function (e) {
				that._fnMouseDown.call( that, e, nTh );
			} );
	},


	/**
	 * Mouse down on a TH element in the table header
	 *  @method  _fnMouseDown
	 *  @param   event e Mouse event
	 *  @param   element nTh TH element to be dragged
	 *  @returns void
	 *  @private
	 */
	"_fnMouseDown": function ( e, nTh )
	{
		var that = this;

		/* Store information about the mouse position */
		var target = $(e.target).closest('th, td');
		var offset = target.offset();
		var idx = parseInt( $(nTh).attr('data-column-index'), 10 );

		if ( idx === undefined ) {
			return;
		}

		this.s.mouse.startX = this._fnCursorPosition( e, 'pageX' );
		this.s.mouse.startY = this._fnCursorPosition( e, 'pageY' );
		this.s.mouse.offsetX = this._fnCursorPosition( e, 'pageX' ) - offset.left;
		this.s.mouse.offsetY = this._fnCursorPosition( e, 'pageY' ) - offset.top;
		this.s.mouse.target = this.s.dt.aoColumns[ idx ].nTh;//target[0];
		this.s.mouse.targetIndex = idx;
		this.s.mouse.fromIndex = idx;

		this._fnRegions();

		/* Add event handlers to the document */
		$(document)
			.on( 'mousemove.ColReorder touchmove.ColReorder', function (e) {
				that._fnMouseMove.call( that, e );
			} )
			.on( 'mouseup.ColReorder touchend.ColReorder', function (e) {
				that._fnMouseUp.call( that, e );
			} );
	},


	/**
	 * Deal with a mouse move event while dragging a node
	 *  @method  _fnMouseMove
	 *  @param   event e Mouse event
	 *  @returns void
	 *  @private
	 */
	"_fnMouseMove": function ( e )
	{
		var that = this;

		if ( this.dom.drag === null )
		{
			/* Only create the drag element if the mouse has moved a specific distance from the start
			 * point - this allows the user to make small mouse movements when sorting and not have a
			 * possibly confusing drag element showing up
			 */
			if ( Math.pow(
				Math.pow(this._fnCursorPosition( e, 'pageX') - this.s.mouse.startX, 2) +
				Math.pow(this._fnCursorPosition( e, 'pageY') - this.s.mouse.startY, 2), 0.5 ) < 5 )
			{
				return;
			}
			this._fnCreateDragNode();
		}

		/* Position the element - we respect where in the element the click occured */
		this.dom.drag.css( {
			left: this._fnCursorPosition( e, 'pageX' ) - this.s.mouse.offsetX,
			top: this._fnCursorPosition( e, 'pageY' ) - this.s.mouse.offsetY
		} );

		/* Based on the current mouse position, calculate where the insert should go */
		var bSet = false;
		var lastToIndex = this.s.mouse.toIndex;

		for ( var i=1, iLen=this.s.aoTargets.length ; i<iLen ; i++ )
		{
			if ( this._fnCursorPosition(e, 'pageX') < this.s.aoTargets[i-1].x + ((this.s.aoTargets[i].x-this.s.aoTargets[i-1].x)/2) )
			{
				this.dom.pointer.css( 'left', this.s.aoTargets[i-1].x );
				this.s.mouse.toIndex = this.s.aoTargets[i-1].to;
				bSet = true;
				break;
			}
		}

		// The insert element wasn't positioned in the array (less than
		// operator), so we put it at the end
		if ( !bSet )
		{
			this.dom.pointer.css( 'left', this.s.aoTargets[this.s.aoTargets.length-1].x );
			this.s.mouse.toIndex = this.s.aoTargets[this.s.aoTargets.length-1].to;
		}

		// Perform reordering if realtime updating is on and the column has moved
		if ( this.s.init.bRealtime && lastToIndex !== this.s.mouse.toIndex ) {
			this.s.dt.oInstance.fnColReorder( this.s.mouse.fromIndex, this.s.mouse.toIndex, false );
			this.s.mouse.fromIndex = this.s.mouse.toIndex;
			this._fnRegions();
		}
	},


	/**
	 * Finish off the mouse drag and insert the column where needed
	 *  @method  _fnMouseUp
	 *  @param   event e Mouse event
	 *  @returns void
	 *  @private
	 */
	"_fnMouseUp": function ( e )
	{
		var that = this;

		$(document).off( '.ColReorder' );

		if ( this.dom.drag !== null )
		{
			/* Remove the guide elements */
			this.dom.drag.remove();
			this.dom.pointer.remove();
			this.dom.drag = null;
			this.dom.pointer = null;

			/* Actually do the reorder */
			this.s.dt.oInstance.fnColReorder( this.s.mouse.fromIndex, this.s.mouse.toIndex, true );
			this._fnSetColumnIndexes();

			/* When scrolling we need to recalculate the column sizes to allow for the shift */
			if ( this.s.dt.oScroll.sX !== "" || this.s.dt.oScroll.sY !== "" )
			{
				this.s.dt.oInstance.fnAdjustColumnSizing( false );
			}

			/* Save the state */
			this.s.dt.oInstance.oApi._fnSaveState( this.s.dt );

			if ( this.s.reorderCallback !== null )
			{
				this.s.reorderCallback.call( this );
			}
		}
	},


	/**
	 * Calculate a cached array with the points of the column inserts, and the
	 * 'to' points
	 *  @method  _fnRegions
	 *  @returns void
	 *  @private
	 */
	"_fnRegions": function ()
	{
		var aoColumns = this.s.dt.aoColumns;

		this.s.aoTargets.splice( 0, this.s.aoTargets.length );

		this.s.aoTargets.push( {
			"x":  $(this.s.dt.nTable).offset().left,
			"to": 0
		} );

		var iToPoint = 0;
		var total = this.s.aoTargets[0].x;

		for ( var i=0, iLen=aoColumns.length ; i<iLen ; i++ )
		{
			/* For the column / header in question, we want it's position to remain the same if the
			 * position is just to it's immediate left or right, so we only increment the counter for
			 * other columns
			 */
			if ( i != this.s.mouse.fromIndex )
			{
				iToPoint++;
			}

			if ( aoColumns[i].bVisible && aoColumns[i].nTh.style.display !=='none' )
			{
				total += $(aoColumns[i].nTh).outerWidth();

				this.s.aoTargets.push( {
					"x":  total,
					"to": iToPoint
				} );
			}
		}

		/* Disallow columns for being reordered by drag and drop, counting right to left */
		if ( this.s.fixedRight !== 0 )
		{
			this.s.aoTargets.splice( this.s.aoTargets.length - this.s.fixedRight );
		}

		/* Disallow columns for being reordered by drag and drop, counting left to right */
		if ( this.s.fixed !== 0 )
		{
			this.s.aoTargets.splice( 0, this.s.fixed );
		}
	},


	/**
	 * Copy the TH element that is being drags so the user has the idea that they are actually
	 * moving it around the page.
	 *  @method  _fnCreateDragNode
	 *  @returns void
	 *  @private
	 */
	"_fnCreateDragNode": function ()
	{
		var scrolling = this.s.dt.oScroll.sX !== "" || this.s.dt.oScroll.sY !== "";

		var origCell = this.s.dt.aoColumns[ this.s.mouse.targetIndex ].nTh;
		var origTr = origCell.parentNode;
		var origThead = origTr.parentNode;
		var origTable = origThead.parentNode;
		var cloneCell = $(origCell).clone();

		// This is a slightly odd combination of jQuery and DOM, but it is the
		// fastest and least resource intensive way I could think of cloning
		// the table with just a single header cell in it.
		this.dom.drag = $(origTable.cloneNode(false))
			.addClass( 'DTCR_clonedTable' )
			.append(
				$(origThead.cloneNode(false)).append(
					$(origTr.cloneNode(false)).append(
						cloneCell[0]
					)
				)
			)
			.css( {
				position: 'absolute',
				top: 0,
				left: 0,
				width: $(origCell).outerWidth(),
				height: $(origCell).outerHeight()
			} )
			.appendTo( 'body' );

		this.dom.pointer = $('<div></div>')
			.addClass( 'DTCR_pointer' )
			.css( {
				position: 'absolute',
				top: scrolling ?
					$('div.dataTables_scroll', this.s.dt.nTableWrapper).offset().top :
					$(this.s.dt.nTable).offset().top,
				height : scrolling ?
					$('div.dataTables_scroll', this.s.dt.nTableWrapper).height() :
					$(this.s.dt.nTable).height()
			} )
			.appendTo( 'body' );
	},


	/**
	 * Add a data attribute to the column headers, so we know the index of
	 * the row to be reordered. This allows fast detection of the index, and
	 * for this plug-in to work with FixedHeader which clones the nodes.
	 *  @private
	 */
	"_fnSetColumnIndexes": function ()
	{
		$.each( this.s.dt.aoColumns, function (i, column) {
			$(column.nTh).attr('data-column-index', i);
		} );
	},


	/**
	 * Get cursor position regardless of mouse or touch input
	 * @param  {Event}  e    jQuery Event
	 * @param  {string} prop Property to get
	 * @return {number}      Value
	 */
	_fnCursorPosition: function ( e, prop ) {
		if ( e.type.indexOf('touch') !== -1 ) {
			return e.originalEvent.touches[0][ prop ];
		}
		return e[ prop ];
	}
} );





/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Static parameters
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/**
 * ColReorder default settings for initialisation
 *  @namespace
 *  @static
 */
ColReorder.defaults = {
	/**
	 * Predefined ordering for the columns that will be applied automatically
	 * on initialisation. If not specified then the order that the columns are
	 * found to be in the HTML is the order used.
	 *  @type array
	 *  @default null
	 *  @static
	 */
	aiOrder: null,

	/**
	 * Redraw the table's column ordering as the end user draws the column
	 * (`true`) or wait until the mouse is released (`false` - default). Note
	 * that this will perform a redraw on each reordering, which involves an
	 * Ajax request each time if you are using server-side processing in
	 * DataTables.
	 *  @type boolean
	 *  @default false
	 *  @static
	 */
	bRealtime: true,

	/**
	 * Indicate how many columns should be fixed in position (counting from the
	 * left). This will typically be 1 if used, but can be as high as you like.
	 *  @type int
	 *  @default 0
	 *  @static
	 */
	iFixedColumnsLeft: 0,

	/**
	 * As `iFixedColumnsRight` but counting from the right.
	 *  @type int
	 *  @default 0
	 *  @static
	 */
	iFixedColumnsRight: 0,

	/**
	 * Callback function that is fired when columns are reordered. The `column-
	 * reorder` event is preferred over this callback
	 *  @type function():void
	 *  @default null
	 *  @static
	 */
	fnReorderCallback: null
};



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Constants
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * ColReorder version
 *  @constant  version
 *  @type      String
 *  @default   As code
 */
ColReorder.version = "1.4.1";



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interfaces
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Expose
$.fn.dataTable.ColReorder = ColReorder;
$.fn.DataTable.ColReorder = ColReorder;


// Register a new feature with DataTables
if ( typeof $.fn.dataTable == "function" &&
     typeof $.fn.dataTableExt.fnVersionCheck == "function" &&
     $.fn.dataTableExt.fnVersionCheck('1.10.8') )
{
	$.fn.dataTableExt.aoFeatures.push( {
		"fnInit": function( settings ) {
			var table = settings.oInstance;

			if ( ! settings._colReorder ) {
				var dtInit = settings.oInit;
				var opts = dtInit.colReorder || dtInit.oColReorder || {};

				new ColReorder( settings, opts );
			}
			else {
				table.oApi._fnLog( settings, 1, "ColReorder attempted to initialise twice. Ignoring second" );
			}

			return null; /* No node for DataTables to insert */
		},
		"cFeature": "R",
		"sFeature": "ColReorder"
	} );
}
else {
	alert( "Warning: ColReorder requires DataTables 1.10.8 or greater - www.datatables.net/download");
}


// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.colReorder', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.colReorder;
	var defaults = DataTable.defaults.colReorder;

	if ( init || defaults ) {
		var opts = $.extend( {}, init, defaults );

		if ( init !== false ) {
			new ColReorder( settings, opts  );
		}
	}
} );


// API augmentation
$.fn.dataTable.Api.register( 'colReorder.reset()', function () {
	return this.iterator( 'table', function ( ctx ) {
		ctx._colReorder.fnReset();
	} );
} );

$.fn.dataTable.Api.register( 'colReorder.order()', function ( set, original ) {
	if ( set ) {
		return this.iterator( 'table', function ( ctx ) {
			ctx._colReorder.fnOrder( set, original );
		} );
	}

	return this.context.length ?
		this.context[0]._colReorder.fnOrder() :
		null;
} );

$.fn.dataTable.Api.register( 'colReorder.transpose()', function ( idx, dir ) {
	return this.context.length && this.context[0]._colReorder ?
		this.context[0]._colReorder.fnTranspose( idx, dir ) :
		idx;
} );

$.fn.dataTable.Api.register( 'colReorder.move()', function( from, to, drop, invalidateRows ) {
	if (this.context.length) {
		this.context[0]._colReorder.s.dt.oInstance.fnColReorder( from, to, drop, invalidateRows );
	}
	return this;
} );


return ColReorder;
}));


/*! FixedColumns 3.2.4
 * ©2010-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     FixedColumns
 * @description Freeze columns in place on a scrolling DataTable
 * @version     3.2.4
 * @file        dataTables.fixedColumns.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2010-2017 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;
var _firefoxScroll;

/**
 * When making use of DataTables' x-axis scrolling feature, you may wish to
 * fix the left most column in place. This plug-in for DataTables provides
 * exactly this option (note for non-scrolling tables, please use the
 * FixedHeader plug-in, which can fix headers and footers). Key
 * features include:
 *
 * * Freezes the left or right most columns to the side of the table
 * * Option to freeze two or more columns
 * * Full integration with DataTables' scrolling options
 * * Speed - FixedColumns is fast in its operation
 *
 *  @class
 *  @constructor
 *  @global
 *  @param {object} dt DataTables instance. With DataTables 1.10 this can also
 *    be a jQuery collection, a jQuery selector, DataTables API instance or
 *    settings object.
 *  @param {object} [init={}] Configuration object for FixedColumns. Options are
 *    defined by {@link FixedColumns.defaults}
 *
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.8.0+
 *
 *  @example
 *      var table = $('#example').dataTable( {
 *        "scrollX": "100%"
 *      } );
 *      new $.fn.dataTable.fixedColumns( table );
 */
var FixedColumns = function ( dt, init ) {
	var that = this;

	/* Sanity check - you just know it will happen */
	if ( ! ( this instanceof FixedColumns ) ) {
		alert( "FixedColumns warning: FixedColumns must be initialised with the 'new' keyword." );
		return;
	}

	if ( init === undefined || init === true ) {
		init = {};
	}

	// Use the DataTables Hungarian notation mapping method, if it exists to
	// provide forwards compatibility for camel case variables
	var camelToHungarian = $.fn.dataTable.camelToHungarian;
	if ( camelToHungarian ) {
		camelToHungarian( FixedColumns.defaults, FixedColumns.defaults, true );
		camelToHungarian( FixedColumns.defaults, init );
	}

	// v1.10 allows the settings object to be got form a number of sources
	var dtSettings = new $.fn.dataTable.Api( dt ).settings()[0];

	/**
	 * Settings object which contains customisable information for FixedColumns instance
	 * @namespace
	 * @extends FixedColumns.defaults
	 * @private
	 */
	this.s = {
		/**
		 * DataTables settings objects
		 *  @type     object
		 *  @default  Obtained from DataTables instance
		 */
		"dt": dtSettings,

		/**
		 * Number of columns in the DataTable - stored for quick access
		 *  @type     int
		 *  @default  Obtained from DataTables instance
		 */
		"iTableColumns": dtSettings.aoColumns.length,

		/**
		 * Original outer widths of the columns as rendered by DataTables - used to calculate
		 * the FixedColumns grid bounding box
		 *  @type     array.<int>
		 *  @default  []
		 */
		"aiOuterWidths": [],

		/**
		 * Original inner widths of the columns as rendered by DataTables - used to apply widths
		 * to the columns
		 *  @type     array.<int>
		 *  @default  []
		 */
		"aiInnerWidths": [],


		/**
		 * Is the document layout right-to-left
		 * @type boolean
		 */
		rtl: $(dtSettings.nTable).css('direction') === 'rtl'
	};


	/**
	 * DOM elements used by the class instance
	 * @namespace
	 * @private
	 *
	 */
	this.dom = {
		/**
		 * DataTables scrolling element
		 *  @type     node
		 *  @default  null
		 */
		"scroller": null,

		/**
		 * DataTables header table
		 *  @type     node
		 *  @default  null
		 */
		"header": null,

		/**
		 * DataTables body table
		 *  @type     node
		 *  @default  null
		 */
		"body": null,

		/**
		 * DataTables footer table
		 *  @type     node
		 *  @default  null
		 */
		"footer": null,

		/**
		 * Display grid elements
		 * @namespace
		 */
		"grid": {
			/**
			 * Grid wrapper. This is the container element for the 3x3 grid
			 *  @type     node
			 *  @default  null
			 */
			"wrapper": null,

			/**
			 * DataTables scrolling element. This element is the DataTables
			 * component in the display grid (making up the main table - i.e.
			 * not the fixed columns).
			 *  @type     node
			 *  @default  null
			 */
			"dt": null,

			/**
			 * Left fixed column grid components
			 * @namespace
			 */
			"left": {
				"wrapper": null,
				"head": null,
				"body": null,
				"foot": null
			},

			/**
			 * Right fixed column grid components
			 * @namespace
			 */
			"right": {
				"wrapper": null,
				"head": null,
				"body": null,
				"foot": null
			}
		},

		/**
		 * Cloned table nodes
		 * @namespace
		 */
		"clone": {
			/**
			 * Left column cloned table nodes
			 * @namespace
			 */
			"left": {
				/**
				 * Cloned header table
				 *  @type     node
				 *  @default  null
				 */
				"header": null,

				/**
				 * Cloned body table
				 *  @type     node
				 *  @default  null
				 */
				"body": null,

				/**
				 * Cloned footer table
				 *  @type     node
				 *  @default  null
				 */
				"footer": null
			},

			/**
			 * Right column cloned table nodes
			 * @namespace
			 */
			"right": {
				/**
				 * Cloned header table
				 *  @type     node
				 *  @default  null
				 */
				"header": null,

				/**
				 * Cloned body table
				 *  @type     node
				 *  @default  null
				 */
				"body": null,

				/**
				 * Cloned footer table
				 *  @type     node
				 *  @default  null
				 */
				"footer": null
			}
		}
	};

	if ( dtSettings._oFixedColumns ) {
		throw 'FixedColumns already initialised on this table';
	}

	/* Attach the instance to the DataTables instance so it can be accessed easily */
	dtSettings._oFixedColumns = this;

	/* Let's do it */
	if ( ! dtSettings._bInitComplete )
	{
		dtSettings.oApi._fnCallbackReg( dtSettings, 'aoInitComplete', function () {
			that._fnConstruct( init );
		}, 'FixedColumns' );
	}
	else
	{
		this._fnConstruct( init );
	}
};



$.extend( FixedColumns.prototype , {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	/**
	 * Update the fixed columns - including headers and footers. Note that FixedColumns will
	 * automatically update the display whenever the host DataTable redraws.
	 *  @returns {void}
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      var fc = new $.fn.dataTable.fixedColumns( table );
	 *
	 *      // at some later point when the table has been manipulated....
	 *      fc.fnUpdate();
	 */
	"fnUpdate": function ()
	{
		this._fnDraw( true );
	},


	/**
	 * Recalculate the resizes of the 3x3 grid that FixedColumns uses for display of the table.
	 * This is useful if you update the width of the table container. Note that FixedColumns will
	 * perform this function automatically when the window.resize event is fired.
	 *  @returns {void}
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      var fc = new $.fn.dataTable.fixedColumns( table );
	 *
	 *      // Resize the table container and then have FixedColumns adjust its layout....
	 *      $('#content').width( 1200 );
	 *      fc.fnRedrawLayout();
	 */
	"fnRedrawLayout": function ()
	{
		this._fnColCalc();
		this._fnGridLayout();
		this.fnUpdate();
	},


	/**
	 * Mark a row such that it's height should be recalculated when using 'semiauto' row
	 * height matching. This function will have no effect when 'none' or 'auto' row height
	 * matching is used.
	 *  @param   {Node} nTr TR element that should have it's height recalculated
	 *  @returns {void}
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      var fc = new $.fn.dataTable.fixedColumns( table );
	 *
	 *      // manipulate the table - mark the row as needing an update then update the table
	 *      // this allows the redraw performed by DataTables fnUpdate to recalculate the row
	 *      // height
	 *      fc.fnRecalculateHeight();
	 *      table.fnUpdate( $('#example tbody tr:eq(0)')[0], ["insert date", 1, 2, 3 ... ]);
	 */
	"fnRecalculateHeight": function ( nTr )
	{
		delete nTr._DTTC_iHeight;
		nTr.style.height = 'auto';
	},


	/**
	 * Set the height of a given row - provides cross browser compatibility
	 *  @param   {Node} nTarget TR element that should have it's height recalculated
	 *  @param   {int} iHeight Height in pixels to set
	 *  @returns {void}
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      var fc = new $.fn.dataTable.fixedColumns( table );
	 *
	 *      // You may want to do this after manipulating a row in the fixed column
	 *      fc.fnSetRowHeight( $('#example tbody tr:eq(0)')[0], 50 );
	 */
	"fnSetRowHeight": function ( nTarget, iHeight )
	{
		nTarget.style.height = iHeight+"px";
	},


	/**
	 * Get data index information about a row or cell in the table body.
	 * This function is functionally identical to fnGetPosition in DataTables,
	 * taking the same parameter (TH, TD or TR node) and returning exactly the
	 * the same information (data index information). THe difference between
	 * the two is that this method takes into account the fixed columns in the
	 * table, so you can pass in nodes from the master table, or the cloned
	 * tables and get the index position for the data in the main table.
	 *  @param {node} node TR, TH or TD element to get the information about
	 *  @returns {int} If nNode is given as a TR, then a single index is 
	 *    returned, or if given as a cell, an array of [row index, column index
	 *    (visible), column index (all)] is given.
	 */
	"fnGetPosition": function ( node )
	{
		var idx;
		var inst = this.s.dt.oInstance;

		if ( ! $(node).parents('.DTFC_Cloned').length )
		{
			// Not in a cloned table
			return inst.fnGetPosition( node );
		}
		else
		{
			// Its in the cloned table, so need to look up position
			if ( node.nodeName.toLowerCase() === 'tr' ) {
				idx = $(node).index();
				return inst.fnGetPosition( $('tr', this.s.dt.nTBody)[ idx ] );
			}
			else
			{
				var colIdx = $(node).index();
				idx = $(node.parentNode).index();
				var row = inst.fnGetPosition( $('tr', this.s.dt.nTBody)[ idx ] );

				return [
					row,
					colIdx,
					inst.oApi._fnVisibleToColumnIndex( this.s.dt, colIdx )
				];
			}
		}
	},



	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods (they are of course public in JS, but recommended as private)
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	/**
	 * Initialisation for FixedColumns
	 *  @param   {Object} oInit User settings for initialisation
	 *  @returns {void}
	 *  @private
	 */
	"_fnConstruct": function ( oInit )
	{
		var i, iLen, iWidth,
			that = this;

		/* Sanity checking */
		if ( typeof this.s.dt.oInstance.fnVersionCheck != 'function' ||
		     this.s.dt.oInstance.fnVersionCheck( '1.8.0' ) !== true )
		{
			alert( "FixedColumns "+FixedColumns.VERSION+" required DataTables 1.8.0 or later. "+
				"Please upgrade your DataTables installation" );
			return;
		}

		if ( this.s.dt.oScroll.sX === "" )
		{
			this.s.dt.oInstance.oApi._fnLog( this.s.dt, 1, "FixedColumns is not needed (no "+
				"x-scrolling in DataTables enabled), so no action will be taken. Use 'FixedHeader' for "+
				"column fixing when scrolling is not enabled" );
			return;
		}

		/* Apply the settings from the user / defaults */
		this.s = $.extend( true, this.s, FixedColumns.defaults, oInit );

		/* Set up the DOM as we need it and cache nodes */
		var classes = this.s.dt.oClasses;
		this.dom.grid.dt = $(this.s.dt.nTable).parents('div.'+classes.sScrollWrapper)[0];
		this.dom.scroller = $('div.'+classes.sScrollBody, this.dom.grid.dt )[0];

		/* Set up the DOM that we want for the fixed column layout grid */
		this._fnColCalc();
		this._fnGridSetup();

		/* Event handlers */
		var mouseController;
		var mouseDown = false;

		// When the mouse is down (drag scroll) the mouse controller cannot
		// change, as the browser keeps the original element as the scrolling one
		$(this.s.dt.nTableWrapper).on( 'mousedown.DTFC', function (e) {
			if ( e.button === 0 ) {
				mouseDown = true;

				$(document).one( 'mouseup', function () {
					mouseDown = false;
				} );
			}
		} );

		// When the body is scrolled - scroll the left and right columns
		$(this.dom.scroller)
			.on( 'mouseover.DTFC touchstart.DTFC', function () {
				if ( ! mouseDown ) {
					mouseController = 'main';
				}
			} )
			.on( 'scroll.DTFC', function (e) {
				if ( ! mouseController && e.originalEvent ) {
					mouseController = 'main';
				}

				if ( mouseController === 'main' ) {
					if ( that.s.iLeftColumns > 0 ) {
						that.dom.grid.left.liner.scrollTop = that.dom.scroller.scrollTop;
					}
					if ( that.s.iRightColumns > 0 ) {
						that.dom.grid.right.liner.scrollTop = that.dom.scroller.scrollTop;
					}
				}
			} );

		var wheelType = 'onwheel' in document.createElement('div') ?
			'wheel.DTFC' :
			'mousewheel.DTFC';

		if ( that.s.iLeftColumns > 0 ) {
			// When scrolling the left column, scroll the body and right column
			$(that.dom.grid.left.liner)
				.on( 'mouseover.DTFC touchstart.DTFC', function () {
					if ( ! mouseDown ) {
						mouseController = 'left';
					}
				} )
				.on( 'scroll.DTFC', function ( e ) {
					if ( ! mouseController && e.originalEvent ) {
						mouseController = 'left';
					}

					if ( mouseController === 'left' ) {
						that.dom.scroller.scrollTop = that.dom.grid.left.liner.scrollTop;
						if ( that.s.iRightColumns > 0 ) {
							that.dom.grid.right.liner.scrollTop = that.dom.grid.left.liner.scrollTop;
						}
					}
				} )
				.on( wheelType, function(e) {
					// Pass horizontal scrolling through
					var xDelta = e.type === 'wheel' ?
						-e.originalEvent.deltaX :
						e.originalEvent.wheelDeltaX;
					that.dom.scroller.scrollLeft -= xDelta;
				} );
		}

		if ( that.s.iRightColumns > 0 ) {
			// When scrolling the right column, scroll the body and the left column
			$(that.dom.grid.right.liner)
				.on( 'mouseover.DTFC touchstart.DTFC', function () {
					if ( ! mouseDown ) {
						mouseController = 'right';
					}
				} )
				.on( 'scroll.DTFC', function ( e ) {
					if ( ! mouseController && e.originalEvent ) {
						mouseController = 'right';
					}

					if ( mouseController === 'right' ) {
						that.dom.scroller.scrollTop = that.dom.grid.right.liner.scrollTop;
						if ( that.s.iLeftColumns > 0 ) {
							that.dom.grid.left.liner.scrollTop = that.dom.grid.right.liner.scrollTop;
						}
					}
				} )
				.on( wheelType, function(e) {
					// Pass horizontal scrolling through
					var xDelta = e.type === 'wheel' ?
						-e.originalEvent.deltaX :
						e.originalEvent.wheelDeltaX;
					that.dom.scroller.scrollLeft -= xDelta;
				} );
		}

		$(window).on( 'resize.DTFC', function () {
			that._fnGridLayout.call( that );
		} );

		var bFirstDraw = true;
		var jqTable = $(this.s.dt.nTable);

		jqTable
			.on( 'draw.dt.DTFC', function () {
				that._fnColCalc();
				that._fnDraw.call( that, bFirstDraw );
				bFirstDraw = false;
			} )
			.on( 'column-sizing.dt.DTFC', function () {
				that._fnColCalc();
				that._fnGridLayout( that );
			} )
			.on( 'column-visibility.dt.DTFC', function ( e, settings, column, vis, recalc ) {
				if ( recalc === undefined || recalc ) {
					that._fnColCalc();
					that._fnGridLayout( that );
					that._fnDraw( true );
				}
			} )
			.on( 'select.dt.DTFC deselect.dt.DTFC', function ( e, dt, type, indexes ) {
				if ( e.namespace === 'dt' ) {
					that._fnDraw( false );
				}
			} )
			.on( 'destroy.dt.DTFC', function () {
				jqTable.off( '.DTFC' );

				$(that.dom.scroller).off( '.DTFC' );
				$(window).off( '.DTFC' );
				$(that.s.dt.nTableWrapper).off( '.DTFC' );

				$(that.dom.grid.left.liner).off( '.DTFC '+wheelType );
				$(that.dom.grid.left.wrapper).remove();

				$(that.dom.grid.right.liner).off( '.DTFC '+wheelType );
				$(that.dom.grid.right.wrapper).remove();
			} );

		/* Get things right to start with - note that due to adjusting the columns, there must be
		 * another redraw of the main table. It doesn't need to be a full redraw however.
		 */
		this._fnGridLayout();
		this.s.dt.oInstance.fnDraw(false);
	},


	/**
	 * Calculate the column widths for the grid layout
	 *  @returns {void}
	 *  @private
	 */
	"_fnColCalc": function ()
	{
		var that = this;
		var iLeftWidth = 0;
		var iRightWidth = 0;

		this.s.aiInnerWidths = [];
		this.s.aiOuterWidths = [];

		$.each( this.s.dt.aoColumns, function (i, col) {
			var th = $(col.nTh);
			var border;

			if ( ! th.filter(':visible').length ) {
				that.s.aiInnerWidths.push( 0 );
				that.s.aiOuterWidths.push( 0 );
			}
			else
			{
				// Inner width is used to assign widths to cells
				// Outer width is used to calculate the container
				var iWidth = th.outerWidth();

				// When working with the left most-cell, need to add on the
				// table's border to the outerWidth, since we need to take
				// account of it, but it isn't in any cell
				if ( that.s.aiOuterWidths.length === 0 ) {
					border = $(that.s.dt.nTable).css('border-left-width');
					iWidth += typeof border === 'string' && border.indexOf('px') === -1 ?
						1 :
						parseInt( border, 10 );
				}

				// Likewise with the final column on the right
				if ( that.s.aiOuterWidths.length === that.s.dt.aoColumns.length-1 ) {
					border = $(that.s.dt.nTable).css('border-right-width');
					iWidth += typeof border === 'string' && border.indexOf('px') === -1 ?
						1 :
						parseInt( border, 10 );
				}

				that.s.aiOuterWidths.push( iWidth );
				that.s.aiInnerWidths.push( th.width() );

				if ( i < that.s.iLeftColumns )
				{
					iLeftWidth += iWidth;
				}

				if ( that.s.iTableColumns-that.s.iRightColumns <= i )
				{
					iRightWidth += iWidth;
				}
			}
		} );

		this.s.iLeftWidth = iLeftWidth;
		this.s.iRightWidth = iRightWidth;
	},


	/**
	 * Set up the DOM for the fixed column. The way the layout works is to create a 1x3 grid
	 * for the left column, the DataTable (for which we just reuse the scrolling element DataTable
	 * puts into the DOM) and the right column. In each of he two fixed column elements there is a
	 * grouping wrapper element and then a head, body and footer wrapper. In each of these we then
	 * place the cloned header, body or footer tables. This effectively gives as 3x3 grid structure.
	 *  @returns {void}
	 *  @private
	 */
	"_fnGridSetup": function ()
	{
		var that = this;
		var oOverflow = this._fnDTOverflow();
		var block;

		this.dom.body = this.s.dt.nTable;
		this.dom.header = this.s.dt.nTHead.parentNode;
		this.dom.header.parentNode.parentNode.style.position = "relative";

		var nSWrapper =
			$('<div class="DTFC_ScrollWrapper" style="position:relative; clear:both;">'+
				'<div class="DTFC_LeftWrapper" style="position:absolute; top:0; left:0;" aria-hidden="true">'+
					'<div class="DTFC_LeftHeadWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div>'+
					'<div class="DTFC_LeftBodyWrapper" style="position:relative; top:0; left:0; overflow:hidden;">'+
						'<div class="DTFC_LeftBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div>'+
					'</div>'+
					'<div class="DTFC_LeftFootWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div>'+
				'</div>'+
				'<div class="DTFC_RightWrapper" style="position:absolute; top:0; right:0;" aria-hidden="true">'+
					'<div class="DTFC_RightHeadWrapper" style="position:relative; top:0; left:0;">'+
						'<div class="DTFC_RightHeadBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div>'+
					'</div>'+
					'<div class="DTFC_RightBodyWrapper" style="position:relative; top:0; left:0; overflow:hidden;">'+
						'<div class="DTFC_RightBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div>'+
					'</div>'+
					'<div class="DTFC_RightFootWrapper" style="position:relative; top:0; left:0;">'+
						'<div class="DTFC_RightFootBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div>'+
					'</div>'+
				'</div>'+
			'</div>')[0];
		var nLeft = nSWrapper.childNodes[0];
		var nRight = nSWrapper.childNodes[1];

		this.dom.grid.dt.parentNode.insertBefore( nSWrapper, this.dom.grid.dt );
		nSWrapper.appendChild( this.dom.grid.dt );

		this.dom.grid.wrapper = nSWrapper;

		if ( this.s.iLeftColumns > 0 )
		{
			this.dom.grid.left.wrapper = nLeft;
			this.dom.grid.left.head = nLeft.childNodes[0];
			this.dom.grid.left.body = nLeft.childNodes[1];
			this.dom.grid.left.liner = $('div.DTFC_LeftBodyLiner', nSWrapper)[0];

			nSWrapper.appendChild( nLeft );
		}

		if ( this.s.iRightColumns > 0 )
		{
			this.dom.grid.right.wrapper = nRight;
			this.dom.grid.right.head = nRight.childNodes[0];
			this.dom.grid.right.body = nRight.childNodes[1];
			this.dom.grid.right.liner = $('div.DTFC_RightBodyLiner', nSWrapper)[0];

			nRight.style.right = oOverflow.bar+"px";

			block = $('div.DTFC_RightHeadBlocker', nSWrapper)[0];
			block.style.width = oOverflow.bar+"px";
			block.style.right = -oOverflow.bar+"px";
			this.dom.grid.right.headBlock = block;

			block = $('div.DTFC_RightFootBlocker', nSWrapper)[0];
			block.style.width = oOverflow.bar+"px";
			block.style.right = -oOverflow.bar+"px";
			this.dom.grid.right.footBlock = block;

			nSWrapper.appendChild( nRight );
		}

		if ( this.s.dt.nTFoot )
		{
			this.dom.footer = this.s.dt.nTFoot.parentNode;
			if ( this.s.iLeftColumns > 0 )
			{
				this.dom.grid.left.foot = nLeft.childNodes[2];
			}
			if ( this.s.iRightColumns > 0 )
			{
				this.dom.grid.right.foot = nRight.childNodes[2];
			}
		}

		// RTL support - swap the position of the left and right columns (#48)
		if ( this.s.rtl ) {
			$('div.DTFC_RightHeadBlocker', nSWrapper).css( {
				left: -oOverflow.bar+'px',
				right: ''
			} );
		}
	},


	/**
	 * Style and position the grid used for the FixedColumns layout
	 *  @returns {void}
	 *  @private
	 */
	"_fnGridLayout": function ()
	{
		var that = this;
		var oGrid = this.dom.grid;
		var iWidth = $(oGrid.wrapper).width();
		var iBodyHeight = this.s.dt.nTable.parentNode.offsetHeight;
		var iFullHeight = this.s.dt.nTable.parentNode.parentNode.offsetHeight;
		var oOverflow = this._fnDTOverflow();
		var iLeftWidth = this.s.iLeftWidth;
		var iRightWidth = this.s.iRightWidth;
		var rtl = $(this.dom.body).css('direction') === 'rtl';
		var wrapper;
		var scrollbarAdjust = function ( node, width ) {
			if ( ! oOverflow.bar ) {
				// If there is no scrollbar (Macs) we need to hide the auto scrollbar
				node.style.width = (width+20)+"px";
				node.style.paddingRight = "20px";
				node.style.boxSizing = "border-box";
			}
			else if ( that._firefoxScrollError() ) {
				// See the above function for why this is required
				if ( $(node).height() > 34 ) {
					node.style.width = (width+oOverflow.bar)+"px";
				}
			}
			else {
				// Otherwise just overflow by the scrollbar
				node.style.width = (width+oOverflow.bar)+"px";
			}
		};

		// When x scrolling - don't paint the fixed columns over the x scrollbar
		if ( oOverflow.x )
		{
			iBodyHeight -= oOverflow.bar;
		}

		oGrid.wrapper.style.height = iFullHeight+"px";

		if ( this.s.iLeftColumns > 0 )
		{
			wrapper = oGrid.left.wrapper;
			wrapper.style.width = iLeftWidth+'px';
			wrapper.style.height = '1px';

			// Swap the position of the left and right columns for rtl (#48)
			// This is always up against the edge, scrollbar on the far side
			if ( rtl ) {
				wrapper.style.left = '';
				wrapper.style.right = 0;
			}
			else {
				wrapper.style.left = 0;
				wrapper.style.right = '';
			}

			oGrid.left.body.style.height = iBodyHeight+"px";
			if ( oGrid.left.foot ) {
				oGrid.left.foot.style.top = (oOverflow.x ? oOverflow.bar : 0)+"px"; // shift footer for scrollbar
			}

			scrollbarAdjust( oGrid.left.liner, iLeftWidth );
			oGrid.left.liner.style.height = iBodyHeight+"px";
			oGrid.left.liner.style.maxHeight = iBodyHeight+"px";
		}

		if ( this.s.iRightColumns > 0 )
		{
			wrapper = oGrid.right.wrapper;
			wrapper.style.width = iRightWidth+'px';
			wrapper.style.height = '1px';

			// Need to take account of the vertical scrollbar
			if ( this.s.rtl ) {
				wrapper.style.left = oOverflow.y ? oOverflow.bar+'px' : 0;
				wrapper.style.right = '';
			}
			else {
				wrapper.style.left = '';
				wrapper.style.right = oOverflow.y ? oOverflow.bar+'px' : 0;
			}

			oGrid.right.body.style.height = iBodyHeight+"px";
			if ( oGrid.right.foot ) {
				oGrid.right.foot.style.top = (oOverflow.x ? oOverflow.bar : 0)+"px";
			}

			scrollbarAdjust( oGrid.right.liner, iRightWidth );
			oGrid.right.liner.style.height = iBodyHeight+"px";
			oGrid.right.liner.style.maxHeight = iBodyHeight+"px";

			oGrid.right.headBlock.style.display = oOverflow.y ? 'block' : 'none';
			oGrid.right.footBlock.style.display = oOverflow.y ? 'block' : 'none';
		}
	},


	/**
	 * Get information about the DataTable's scrolling state - specifically if the table is scrolling
	 * on either the x or y axis, and also the scrollbar width.
	 *  @returns {object} Information about the DataTables scrolling state with the properties:
	 *    'x', 'y' and 'bar'
	 *  @private
	 */
	"_fnDTOverflow": function ()
	{
		var nTable = this.s.dt.nTable;
		var nTableScrollBody = nTable.parentNode;
		var out = {
			"x": false,
			"y": false,
			"bar": this.s.dt.oScroll.iBarWidth
		};

		if ( nTable.offsetWidth > nTableScrollBody.clientWidth )
		{
			out.x = true;
		}

		if ( nTable.offsetHeight > nTableScrollBody.clientHeight )
		{
			out.y = true;
		}

		return out;
	},


	/**
	 * Clone and position the fixed columns
	 *  @returns {void}
	 *  @param   {Boolean} bAll Indicate if the header and footer should be updated as well (true)
	 *  @private
	 */
	"_fnDraw": function ( bAll )
	{
		this._fnGridLayout();
		this._fnCloneLeft( bAll );
		this._fnCloneRight( bAll );

		/* Draw callback function */
		if ( this.s.fnDrawCallback !== null )
		{
			this.s.fnDrawCallback.call( this, this.dom.clone.left, this.dom.clone.right );
		}

		/* Event triggering */
		$(this).trigger( 'draw.dtfc', {
			"leftClone": this.dom.clone.left,
			"rightClone": this.dom.clone.right
		} );
	},


	/**
	 * Clone the right columns
	 *  @returns {void}
	 *  @param   {Boolean} bAll Indicate if the header and footer should be updated as well (true)
	 *  @private
	 */
	"_fnCloneRight": function ( bAll )
	{
		if ( this.s.iRightColumns <= 0 ) {
			return;
		}

		var that = this,
			i, jq,
			aiColumns = [];

		for ( i=this.s.iTableColumns-this.s.iRightColumns ; i<this.s.iTableColumns ; i++ ) {
			if ( this.s.dt.aoColumns[i].bVisible ) {
				aiColumns.push( i );
			}
		}

		this._fnClone( this.dom.clone.right, this.dom.grid.right, aiColumns, bAll );
	},


	/**
	 * Clone the left columns
	 *  @returns {void}
	 *  @param   {Boolean} bAll Indicate if the header and footer should be updated as well (true)
	 *  @private
	 */
	"_fnCloneLeft": function ( bAll )
	{
		if ( this.s.iLeftColumns <= 0 ) {
			return;
		}

		var that = this,
			i, jq,
			aiColumns = [];

		for ( i=0 ; i<this.s.iLeftColumns ; i++ ) {
			if ( this.s.dt.aoColumns[i].bVisible ) {
				aiColumns.push( i );
			}
		}

		this._fnClone( this.dom.clone.left, this.dom.grid.left, aiColumns, bAll );
	},


	/**
	 * Make a copy of the layout object for a header or footer element from DataTables. Note that
	 * this method will clone the nodes in the layout object.
	 *  @returns {Array} Copy of the layout array
	 *  @param   {Object} aoOriginal Layout array from DataTables (aoHeader or aoFooter)
	 *  @param   {Object} aiColumns Columns to copy
	 *  @param   {boolean} events Copy cell events or not
	 *  @private
	 */
	"_fnCopyLayout": function ( aoOriginal, aiColumns, events )
	{
		var aReturn = [];
		var aClones = [];
		var aCloned = [];

		for ( var i=0, iLen=aoOriginal.length ; i<iLen ; i++ )
		{
			var aRow = [];
			aRow.nTr = $(aoOriginal[i].nTr).clone(events, false)[0];

			for ( var j=0, jLen=this.s.iTableColumns ; j<jLen ; j++ )
			{
				if ( $.inArray( j, aiColumns ) === -1 )
				{
					continue;
				}

				var iCloned = $.inArray( aoOriginal[i][j].cell, aCloned );
				if ( iCloned === -1 )
				{
					var nClone = $(aoOriginal[i][j].cell).clone(events, false)[0];
					aClones.push( nClone );
					aCloned.push( aoOriginal[i][j].cell );

					aRow.push( {
						"cell": nClone,
						"unique": aoOriginal[i][j].unique
					} );
				}
				else
				{
					aRow.push( {
						"cell": aClones[ iCloned ],
						"unique": aoOriginal[i][j].unique
					} );
				}
			}

			aReturn.push( aRow );
		}

		return aReturn;
	},


	/**
	 * Clone the DataTable nodes and place them in the DOM (sized correctly)
	 *  @returns {void}
	 *  @param   {Object} oClone Object containing the header, footer and body cloned DOM elements
	 *  @param   {Object} oGrid Grid object containing the display grid elements for the cloned
	 *                    column (left or right)
	 *  @param   {Array} aiColumns Column indexes which should be operated on from the DataTable
	 *  @param   {Boolean} bAll Indicate if the header and footer should be updated as well (true)
	 *  @private
	 */
	"_fnClone": function ( oClone, oGrid, aiColumns, bAll )
	{
		var that = this,
			i, iLen, j, jLen, jq, nTarget, iColumn, nClone, iIndex, aoCloneLayout,
			jqCloneThead, aoFixedHeader,
			dt = this.s.dt;

		/*
		 * Header
		 */
		if ( bAll )
		{
			$(oClone.header).remove();

			oClone.header = $(this.dom.header).clone(true, false)[0];
			oClone.header.className += " DTFC_Cloned";
			oClone.header.style.width = "100%";
			oGrid.head.appendChild( oClone.header );

			/* Copy the DataTables layout cache for the header for our floating column */
			aoCloneLayout = this._fnCopyLayout( dt.aoHeader, aiColumns, true );
			jqCloneThead = $('>thead', oClone.header);
			jqCloneThead.empty();

			/* Add the created cloned TR elements to the table */
			for ( i=0, iLen=aoCloneLayout.length ; i<iLen ; i++ )
			{
				jqCloneThead[0].appendChild( aoCloneLayout[i].nTr );
			}

			/* Use the handy _fnDrawHead function in DataTables to do the rowspan/colspan
			 * calculations for us
			 */
			dt.oApi._fnDrawHead( dt, aoCloneLayout, true );
		}
		else
		{
			/* To ensure that we copy cell classes exactly, regardless of colspan, multiple rows
			 * etc, we make a copy of the header from the DataTable again, but don't insert the
			 * cloned cells, just copy the classes across. To get the matching layout for the
			 * fixed component, we use the DataTables _fnDetectHeader method, allowing 1:1 mapping
			 */
			aoCloneLayout = this._fnCopyLayout( dt.aoHeader, aiColumns, false );
			aoFixedHeader=[];

			dt.oApi._fnDetectHeader( aoFixedHeader, $('>thead', oClone.header)[0] );

			for ( i=0, iLen=aoCloneLayout.length ; i<iLen ; i++ )
			{
				for ( j=0, jLen=aoCloneLayout[i].length ; j<jLen ; j++ )
				{
					aoFixedHeader[i][j].cell.className = aoCloneLayout[i][j].cell.className;

					// If jQuery UI theming is used we need to copy those elements as well
					$('span.DataTables_sort_icon', aoFixedHeader[i][j].cell).each( function () {
						this.className = $('span.DataTables_sort_icon', aoCloneLayout[i][j].cell)[0].className;
					} );
				}
			}
		}
		this._fnEqualiseHeights( 'thead', this.dom.header, oClone.header );

		/*
		 * Body
		 */
		if ( this.s.sHeightMatch == 'auto' )
		{
			/* Remove any heights which have been applied already and let the browser figure it out */
			$('>tbody>tr', that.dom.body).css('height', 'auto');
		}

		if ( oClone.body !== null )
		{
			$(oClone.body).remove();
			oClone.body = null;
		}

		oClone.body = $(this.dom.body).clone(true)[0];
		oClone.body.className += " DTFC_Cloned";
		oClone.body.style.paddingBottom = dt.oScroll.iBarWidth+"px";
		oClone.body.style.marginBottom = (dt.oScroll.iBarWidth*2)+"px"; /* For IE */
		if ( oClone.body.getAttribute('id') !== null )
		{
			oClone.body.removeAttribute('id');
		}

		$('>thead>tr', oClone.body).empty();
		$('>tfoot', oClone.body).remove();

		var nBody = $('tbody', oClone.body)[0];
		$(nBody).empty();
		if ( dt.aiDisplay.length > 0 )
		{
			/* Copy the DataTables' header elements to force the column width in exactly the
			 * same way that DataTables does it - have the header element, apply the width and
			 * colapse it down
			 */
			var nInnerThead = $('>thead>tr', oClone.body)[0];
			for ( iIndex=0 ; iIndex<aiColumns.length ; iIndex++ )
			{
				iColumn = aiColumns[iIndex];

				nClone = $(dt.aoColumns[iColumn].nTh).clone(true)[0];
				nClone.innerHTML = "";

				var oStyle = nClone.style;
				oStyle.paddingTop = "0";
				oStyle.paddingBottom = "0";
				oStyle.borderTopWidth = "0";
				oStyle.borderBottomWidth = "0";
				oStyle.height = 0;
				oStyle.width = that.s.aiInnerWidths[iColumn]+"px";

				nInnerThead.appendChild( nClone );
			}

			/* Add in the tbody elements, cloning form the master table */
			$('>tbody>tr', that.dom.body).each( function (z) {
				var i = that.s.dt.oFeatures.bServerSide===false ?
					that.s.dt.aiDisplay[ that.s.dt._iDisplayStart+z ] : z;
				var aTds = that.s.dt.aoData[ i ].anCells || $(this).children('td, th');

				var n = this.cloneNode(false);
				n.removeAttribute('id');
				n.setAttribute( 'data-dt-row', i );

				for ( iIndex=0 ; iIndex<aiColumns.length ; iIndex++ )
				{
					iColumn = aiColumns[iIndex];

					if ( aTds.length > 0 )
					{
						nClone = $( aTds[iColumn] ).clone(true, true)[0];
						nClone.removeAttribute( 'id' );
						nClone.setAttribute( 'data-dt-row', i );
						nClone.setAttribute( 'data-dt-column', dt.oApi._fnVisibleToColumnIndex( dt, iColumn ) );
						n.appendChild( nClone );
					}
				}
				nBody.appendChild( n );
			} );
		}
		else
		{
			$('>tbody>tr', that.dom.body).each( function (z) {
				nClone = this.cloneNode(true);
				nClone.className += ' DTFC_NoData';
				$('td', nClone).html('');
				nBody.appendChild( nClone );
			} );
		}

		oClone.body.style.width = "100%";
		oClone.body.style.margin = "0";
		oClone.body.style.padding = "0";

		// Interop with Scroller - need to use a height forcing element in the
		// scrolling area in the same way that Scroller does in the body scroll.
		if ( dt.oScroller !== undefined )
		{
			var scrollerForcer = dt.oScroller.dom.force;

			if ( ! oGrid.forcer ) {
				oGrid.forcer = scrollerForcer.cloneNode( true );
				oGrid.liner.appendChild( oGrid.forcer );
			}
			else {
				oGrid.forcer.style.height = scrollerForcer.style.height;
			}
		}

		oGrid.liner.appendChild( oClone.body );

		this._fnEqualiseHeights( 'tbody', that.dom.body, oClone.body );

		/*
		 * Footer
		 */
		if ( dt.nTFoot !== null )
		{
			if ( bAll )
			{
				if ( oClone.footer !== null )
				{
					oClone.footer.parentNode.removeChild( oClone.footer );
				}
				oClone.footer = $(this.dom.footer).clone(true, true)[0];
				oClone.footer.className += " DTFC_Cloned";
				oClone.footer.style.width = "100%";
				oGrid.foot.appendChild( oClone.footer );

				/* Copy the footer just like we do for the header */
				aoCloneLayout = this._fnCopyLayout( dt.aoFooter, aiColumns, true );
				var jqCloneTfoot = $('>tfoot', oClone.footer);
				jqCloneTfoot.empty();

				for ( i=0, iLen=aoCloneLayout.length ; i<iLen ; i++ )
				{
					jqCloneTfoot[0].appendChild( aoCloneLayout[i].nTr );
				}
				dt.oApi._fnDrawHead( dt, aoCloneLayout, true );
			}
			else
			{
				aoCloneLayout = this._fnCopyLayout( dt.aoFooter, aiColumns, false );
				var aoCurrFooter=[];

				dt.oApi._fnDetectHeader( aoCurrFooter, $('>tfoot', oClone.footer)[0] );

				for ( i=0, iLen=aoCloneLayout.length ; i<iLen ; i++ )
				{
					for ( j=0, jLen=aoCloneLayout[i].length ; j<jLen ; j++ )
					{
						aoCurrFooter[i][j].cell.className = aoCloneLayout[i][j].cell.className;
					}
				}
			}
			this._fnEqualiseHeights( 'tfoot', this.dom.footer, oClone.footer );
		}

		/* Equalise the column widths between the header footer and body - body get's priority */
		var anUnique = dt.oApi._fnGetUniqueThs( dt, $('>thead', oClone.header)[0] );
		$(anUnique).each( function (i) {
			iColumn = aiColumns[i];
			this.style.width = that.s.aiInnerWidths[iColumn]+"px";
		} );

		if ( that.s.dt.nTFoot !== null )
		{
			anUnique = dt.oApi._fnGetUniqueThs( dt, $('>tfoot', oClone.footer)[0] );
			$(anUnique).each( function (i) {
				iColumn = aiColumns[i];
				this.style.width = that.s.aiInnerWidths[iColumn]+"px";
			} );
		}
	},


	/**
	 * From a given table node (THEAD etc), get a list of TR direct child elements
	 *  @param   {Node} nIn Table element to search for TR elements (THEAD, TBODY or TFOOT element)
	 *  @returns {Array} List of TR elements found
	 *  @private
	 */
	"_fnGetTrNodes": function ( nIn )
	{
		var aOut = [];
		for ( var i=0, iLen=nIn.childNodes.length ; i<iLen ; i++ )
		{
			if ( nIn.childNodes[i].nodeName.toUpperCase() == "TR" )
			{
				aOut.push( nIn.childNodes[i] );
			}
		}
		return aOut;
	},


	/**
	 * Equalise the heights of the rows in a given table node in a cross browser way
	 *  @returns {void}
	 *  @param   {String} nodeName Node type - thead, tbody or tfoot
	 *  @param   {Node} original Original node to take the heights from
	 *  @param   {Node} clone Copy the heights to
	 *  @private
	 */
	"_fnEqualiseHeights": function ( nodeName, original, clone )
	{
		if ( this.s.sHeightMatch == 'none' && nodeName !== 'thead' && nodeName !== 'tfoot' )
		{
			return;
		}

		var that = this,
			i, iLen, iHeight, iHeight2, iHeightOriginal, iHeightClone,
			rootOriginal = original.getElementsByTagName(nodeName)[0],
			rootClone    = clone.getElementsByTagName(nodeName)[0],
			jqBoxHack    = $('>'+nodeName+'>tr:eq(0)', original).children(':first'),
			iBoxHack     = jqBoxHack.outerHeight() - jqBoxHack.height(),
			anOriginal   = this._fnGetTrNodes( rootOriginal ),
			anClone      = this._fnGetTrNodes( rootClone ),
			heights      = [];

		for ( i=0, iLen=anClone.length ; i<iLen ; i++ )
		{
			iHeightOriginal = anOriginal[i].offsetHeight;
			iHeightClone = anClone[i].offsetHeight;
			iHeight = iHeightClone > iHeightOriginal ? iHeightClone : iHeightOriginal;

			if ( this.s.sHeightMatch == 'semiauto' )
			{
				anOriginal[i]._DTTC_iHeight = iHeight;
			}

			heights.push( iHeight );
		}

		for ( i=0, iLen=anClone.length ; i<iLen ; i++ )
		{
			anClone[i].style.height = heights[i]+"px";
			anOriginal[i].style.height = heights[i]+"px";
		}
	},

	/**
	 * Determine if the UA suffers from Firefox's overflow:scroll scrollbars
	 * not being shown bug.
	 *
	 * Firefox doesn't draw scrollbars, even if it is told to using
	 * overflow:scroll, if the div is less than 34px height. See bugs 292284 and
	 * 781885. Using UA detection here since this is particularly hard to detect
	 * using objects - its a straight up rendering error in Firefox.
	 *
	 * @return {boolean} True if Firefox error is present, false otherwise
	 */
	_firefoxScrollError: function () {
		if ( _firefoxScroll === undefined ) {
			var test = $('<div/>')
				.css( {
					position: 'absolute',
					top: 0,
					left: 0,
					height: 10,
					width: 50,
					overflow: 'scroll'
				} )
				.appendTo( 'body' );

			// Make sure this doesn't apply on Macs with 0 width scrollbars
			_firefoxScroll = (
				test[0].clientWidth === test[0].offsetWidth && this._fnDTOverflow().bar !== 0
			);

			test.remove();
		}

		return _firefoxScroll;
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * FixedColumns default settings for initialisation
 *  @name FixedColumns.defaults
 *  @namespace
 *  @static
 */
FixedColumns.defaults = /** @lends FixedColumns.defaults */{
	/**
	 * Number of left hand columns to fix in position
	 *  @type     int
	 *  @default  1
	 *  @static
	 *  @example
	 *      var  = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      new $.fn.dataTable.fixedColumns( table, {
	 *          "leftColumns": 2
	 *      } );
	 */
	"iLeftColumns": 1,

	/**
	 * Number of right hand columns to fix in position
	 *  @type     int
	 *  @default  0
	 *  @static
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      new $.fn.dataTable.fixedColumns( table, {
	 *          "rightColumns": 1
	 *      } );
	 */
	"iRightColumns": 0,

	/**
	 * Draw callback function which is called when FixedColumns has redrawn the fixed assets
	 *  @type     function(object, object):void
	 *  @default  null
	 *  @static
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      new $.fn.dataTable.fixedColumns( table, {
	 *          "drawCallback": function () {
	 *	            alert( "FixedColumns redraw" );
	 *	        }
	 *      } );
	 */
	"fnDrawCallback": null,

	/**
	 * Height matching algorthim to use. This can be "none" which will result in no height
	 * matching being applied by FixedColumns (height matching could be forced by CSS in this
	 * case), "semiauto" whereby the height calculation will be performed once, and the result
	 * cached to be used again (fnRecalculateHeight can be used to force recalculation), or
	 * "auto" when height matching is performed on every draw (slowest but must accurate)
	 *  @type     string
	 *  @default  semiauto
	 *  @static
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      new $.fn.dataTable.fixedColumns( table, {
	 *          "heightMatch": "auto"
	 *      } );
	 */
	"sHeightMatch": "semiauto"
};




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Constants
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * FixedColumns version
 *  @name      FixedColumns.version
 *  @type      String
 *  @default   See code
 *  @static
 */
FixedColumns.version = "3.2.4";



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API integration
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

DataTable.Api.register( 'fixedColumns()', function () {
	return this;
} );

DataTable.Api.register( 'fixedColumns().update()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._oFixedColumns ) {
			ctx._oFixedColumns.fnUpdate();
		}
	} );
} );

DataTable.Api.register( 'fixedColumns().relayout()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._oFixedColumns ) {
			ctx._oFixedColumns.fnRedrawLayout();
		}
	} );
} );

DataTable.Api.register( 'rows().recalcHeight()', function () {
	return this.iterator( 'row', function ( ctx, idx ) {
		if ( ctx._oFixedColumns ) {
			ctx._oFixedColumns.fnRecalculateHeight( this.row(idx).node() );
		}
	} );
} );

DataTable.Api.register( 'fixedColumns().rowIndex()', function ( row ) {
	row = $(row);

	return row.parents('.DTFC_Cloned').length ?
		this.rows( { page: 'current' } ).indexes()[ row.index() ] :
		this.row( row ).index();
} );

DataTable.Api.register( 'fixedColumns().cellIndex()', function ( cell ) {
	cell = $(cell);

	if ( cell.parents('.DTFC_Cloned').length ) {
		var rowClonedIdx = cell.parent().index();
		var rowIdx = this.rows( { page: 'current' } ).indexes()[ rowClonedIdx ];
		var columnIdx;

		if ( cell.parents('.DTFC_LeftWrapper').length ) {
			columnIdx = cell.index();
		}
		else {
			var columns = this.columns().flatten().length;
			columnIdx = columns - this.context[0]._oFixedColumns.s.iRightColumns + cell.index();
		}

		return {
			row: rowIdx,
			column: this.column.index( 'toData', columnIdx ),
			columnVisible: columnIdx
		};
	}
	else {
		return this.cell( cell ).index();
	}
} );




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'init.dt.fixedColumns', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.fixedColumns;
	var defaults = DataTable.defaults.fixedColumns;

	if ( init || defaults ) {
		var opts = $.extend( {}, init, defaults );

		if ( init !== false ) {
			new FixedColumns( settings, opts );
		}
	}
} );



// Make FixedColumns accessible from the DataTables instance
$.fn.dataTable.FixedColumns = FixedColumns;
$.fn.DataTable.FixedColumns = FixedColumns;

return FixedColumns;
}));


/*! KeyTable 2.3.2
 * ©2009-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     KeyTable
 * @description Spreadsheet like keyboard navigation for DataTables
 * @version     2.3.2
 * @file        dataTables.keyTable.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2009-2017 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


var KeyTable = function ( dt, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.8' ) ) {
		throw 'KeyTable requires DataTables 1.10.8 or newer';
	}

	// User and defaults configuration object
	this.c = $.extend( true, {},
		DataTable.defaults.keyTable,
		KeyTable.defaults,
		opts
	);

	// Internal settings
	this.s = {
		/** @type {DataTable.Api} DataTables' API instance */
		dt: new DataTable.Api( dt ),

		enable: true,

		/** @type {bool} Flag for if a draw is triggered by focus */
		focusDraw: false,

		/** @type {bool} Flag to indicate when waiting for a draw to happen.
		  *   Will ignore key presses at this point
		  */
		waitingForDraw: false,

		/** @type {object} Information about the last cell that was focused */
		lastFocus: null
	};

	// DOM items
	this.dom = {

	};

	// Check if row reorder has already been initialised on this table
	var settings = this.s.dt.settings()[0];
	var exisiting = settings.keytable;
	if ( exisiting ) {
		return exisiting;
	}

	settings.keytable = this;
	this._constructor();
};


$.extend( KeyTable.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * API methods for DataTables API interface
	 */

	/**
	 * Blur the table's cell focus
	 */
	blur: function ()
	{
		this._blur();
	},

	/**
	 * Enable cell focus for the table
	 *
	 * @param  {string} state Can be `true`, `false` or `-string navigation-only`
	 */
	enable: function ( state )
	{
		this.s.enable = state;
	},

	/**
	 * Focus on a cell
	 * @param  {integer} row    Row index
	 * @param  {integer} column Column index
	 */
	focus: function ( row, column )
	{
		this._focus( this.s.dt.cell( row, column ) );
	},

	/**
	 * Is the cell focused
	 * @param  {object} cell Cell index to check
	 * @returns {boolean} true if focused, false otherwise
	 */
	focused: function ( cell )
	{
		var lastFocus = this.s.lastFocus;

		if ( ! lastFocus ) {
			return false;
		}

		var lastIdx = this.s.lastFocus.cell.index();
		return cell.row === lastIdx.row && cell.column === lastIdx.column;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the KeyTable instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		this._tabInput();

		var that = this;
		var dt = this.s.dt;
		var table = $( dt.table().node() );

		// Need to be able to calculate the cell positions relative to the table
		if ( table.css('position') === 'static' ) {
			table.css( 'position', 'relative' );
		}

		// Click to focus
		$( dt.table().body() ).on( 'click.keyTable', 'th, td', function (e) {
			if ( that.s.enable === false ) {
				return;
			}

			var cell = dt.cell( this );

			if ( ! cell.any() ) {
				return;
			}

			that._focus( cell, null, false, e );
		} );

		// Key events
		$( document ).on( 'keydown.keyTable', function (e) {
			that._key( e );
		} );

		// Click blur
		if ( this.c.blurable ) {
			$( document ).on( 'mousedown.keyTable', function ( e ) {
				// Click on the search input will blur focus
				if ( $(e.target).parents( '.dataTables_filter' ).length ) {
					that._blur();
				}

				// If the click was inside the DataTables container, don't blur
				if ( $(e.target).parents().filter( dt.table().container() ).length ) {
					return;
				}

				// Don't blur in Editor form
				if ( $(e.target).parents('div.DTE').length ) {
					return;
				}

				// Or an Editor date input
				if ( $(e.target).parents('div.editor-datetime').length ) {
					return;
				}

				//If the click was inside the fixed columns container, don't blur
				if ( $(e.target).parents().filter('.DTFC_Cloned').length ) {
					return;
				}

				that._blur();
			} );
		}

		if ( this.c.editor ) {
			var editor = this.c.editor;

			// Need to disable KeyTable when the main editor is shown
			editor.on( 'open.keyTableMain', function (e, mode, action) {
				if ( mode !== 'inline' && that.s.enable ) {
					that.enable( false );

					editor.one( 'close.keyTable', function () {
						that.enable( true );
					} );
				}
			} );

			if ( this.c.editOnFocus ) {
				dt.on( 'key-focus.keyTable key-refocus.keyTable', function ( e, dt, cell, orig ) {
					that._editor( null, orig );
				} );
			}

			// Activate Editor when a key is pressed (will be ignored, if
			// already active).
			dt.on( 'key.keyTable', function ( e, dt, key, cell, orig ) {
				that._editor( key, orig );
			} );
		}

		// Stave saving
		if ( dt.settings()[0].oFeatures.bStateSave ) {
			dt.on( 'stateSaveParams.keyTable', function (e, s, d) {
				d.keyTable = that.s.lastFocus ?
					that.s.lastFocus.cell.index() :
					null;
			} );
		}

		// Redraw - retain focus on the current cell
		dt.on( 'draw.keyTable', function (e) {
			if ( that.s.focusDraw ) {
				return;
			}

			var lastFocus = that.s.lastFocus;

			if ( lastFocus && lastFocus.node && $(lastFocus.node).closest('body') === document.body ) {
				var relative = that.s.lastFocus.relative;
				var info = dt.page.info();
				var row = relative.row + info.start;

				if ( info.recordsDisplay === 0 ) {
					return;
				}

				// Reverse if needed
				if ( row >= info.recordsDisplay ) {
					row = info.recordsDisplay - 1;
				}

				that._focus( row, relative.column, true, e );
			}
		} );

		dt.on( 'destroy.keyTable', function () {
			dt.off( '.keyTable' );
			$( dt.table().body() ).off( 'click.keyTable', 'th, td' );
			$( document.body )
				.off( 'keydown.keyTable' )
				.off( 'click.keyTable' );
		} );

		// Initial focus comes from state or options
		var state = dt.state.loaded();

		if ( state && state.keyTable ) {
			// Wait until init is done
			dt.one( 'init', function () {
				var cell = dt.cell( state.keyTable );

				// Ensure that the saved cell still exists
				if ( cell.any() ) {
					cell.focus();
				}
			} );
		}
		else if ( this.c.focus ) {
			dt.cell( this.c.focus ).focus();
		}
	},




	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Blur the control
	 *
	 * @private
	 */
	_blur: function ()
	{
		if ( ! this.s.enable || ! this.s.lastFocus ) {
			return;
		}

		var cell = this.s.lastFocus.cell;

		$( cell.node() ).removeClass( this.c.className );
		this.s.lastFocus = null;

		this._updateFixedColumns(cell.index().column);

		this._emitEvent( 'key-blur', [ this.s.dt, cell ] );
	},

	/**
	 * Copy text from the focused cell to clipboard
	 *
	 * @private
	 */
	_clipboardCopy: function ()
	{
		var dt = this.s.dt;

		// If there is a cell focused, and there is no other text selected
		// allow the focused cell's text to be copied to clipboard
		if ( this.s.lastFocus && window.getSelection && !window.getSelection().toString() ) {
			var cell = this.s.lastFocus.cell;
			var text = cell.render('display');
			var hiddenDiv = $('<div/>')
				.css( {
					height: 1,
					width: 1,
					overflow: 'hidden',
					position: 'fixed',
					top: 0,
					left: 0
				} );
			var textarea = $('<textarea readonly/>')
				.val( text )
				.appendTo( hiddenDiv );

			try {
				hiddenDiv.appendTo( dt.table().container() );
				textarea[0].focus();
				textarea[0].select();

				document.execCommand( 'copy' );
			}
			catch (e) {}

			hiddenDiv.remove();
		}
	},


	/**
	 * Get an array of the column indexes that KeyTable can operate on. This
	 * is a merge of the user supplied columns and the visible columns.
	 *
	 * @private
	 */
	_columns: function ()
	{
		var dt = this.s.dt;
		var user = dt.columns( this.c.columns ).indexes();
		var out = [];

		dt.columns( ':visible' ).every( function (i) {
			if ( user.indexOf( i ) !== -1 ) {
				out.push( i );
			}
		} );

		return out;
	},


	/**
	 * Perform excel like navigation for Editor by triggering an edit on key
	 * press
	 *
	 * @param  {integer} key Key code for the pressed key
	 * @param  {object} orig Original event
	 * @private
	 */
	_editor: function ( key, orig )
	{
		var that = this;
		var dt = this.s.dt;
		var editor = this.c.editor;

		// Do nothing if there is already an inline edit in this cell
		if ( $('div.DTE', this.s.lastFocus.cell.node()).length ) {
			return;
		}

		// Don't activate inline editing when the shift key is pressed
		if ( key === 16 ) {
			return;
		}

		orig.stopPropagation();

		// Return key should do nothing - for textareas it would empty the
		// contents
		if ( key === 13 ) {
			orig.preventDefault();
		}

		editor
			.one( 'open.keyTable', function () {
				// Remove cancel open
				editor.off( 'cancelOpen.keyTable' );

				// Excel style - select all text
				if ( that.c.editAutoSelect ) {
					$('div.DTE_Field_InputControl input, div.DTE_Field_InputControl textarea').select();
				}

				// Reduce the keys the Keys listens for
				dt.keys.enable( that.c.editorKeys );

				// On blur of the navigation submit
				dt.one( 'key-blur.editor', function () {
					if ( editor.displayed() ) {
						editor.submit();
					}
				} );

				// Restore full key navigation on close
				editor.one( 'close', function () {
					dt.keys.enable( true );
					dt.off( 'key-blur.editor' );
				} );
			} )
			.one( 'cancelOpen.keyTable', function () {
				// `preOpen` can cancel the display of the form, so it
				// might be that the open event handler isn't needed
				editor.off( 'open.keyTable' );
			} )
			.inline( this.s.lastFocus.cell.index() );
	},


	/**
	 * Emit an event on the DataTable for listeners
	 *
	 * @param  {string} name Event name
	 * @param  {array} args Event arguments
	 * @private
	 */
	_emitEvent: function ( name, args )
	{
		this.s.dt.iterator( 'table', function ( ctx, i ) {
			$(ctx.nTable).triggerHandler( name, args );
		} );
	},


	/**
	 * Focus on a particular cell, shifting the table's paging if required
	 *
	 * @param  {DataTables.Api|integer} row Can be given as an API instance that
	 *   contains the cell to focus or as an integer. As the latter it is the
	 *   visible row index (from the whole data set) - NOT the data index
	 * @param  {integer} [column] Not required if a cell is given as the first
	 *   parameter. Otherwise this is the column data index for the cell to
	 *   focus on
	 * @param {boolean} [shift=true] Should the viewport be moved to show cell
	 * @private
	 */
	_focus: function ( row, column, shift, originalEvent )
	{
		var that = this;
		var dt = this.s.dt;
		var pageInfo = dt.page.info();
		var lastFocus = this.s.lastFocus;

		if ( ! originalEvent) {
			originalEvent = null;
		}

		if ( ! this.s.enable ) {
			return;
		}

		if ( typeof row !== 'number' ) {
			// Convert the cell to a row and column
			var index = row.index();
			column = index.column;
			row = dt
				.rows( { filter: 'applied', order: 'applied' } )
				.indexes()
				.indexOf( index.row );

			// For server-side processing normalise the row by adding the start
			// point, since `rows().indexes()` includes only rows that are
			// available at the client-side
			if ( pageInfo.serverSide ) {
				row += pageInfo.start;
			}
		}

		// Is the row on the current page? If not, we need to redraw to show the
		// page
		if ( pageInfo.length !== -1 && (row < pageInfo.start || row >= pageInfo.start+pageInfo.length) ) {
			this.s.focusDraw = true;
			this.s.waitingForDraw = true;

			dt
				.one( 'draw', function () {
					that.s.focusDraw = false;
					that.s.waitingForDraw = false;
					that._focus( row, column, undefined, originalEvent );
				} )
				.page( Math.floor( row / pageInfo.length ) )
				.draw( false );

			return;
		}

		// In the available columns?
		if ( $.inArray( column, this._columns() ) === -1 ) {
			return;
		}

		// De-normalise the server-side processing row, so we select the row
		// in its displayed position
		if ( pageInfo.serverSide ) {
			row -= pageInfo.start;
		}

		// Get the cell from the current position - ignoring any cells which might
		// not have been rendered (therefore can't use `:eq()` selector).
		var cells = dt.cells( null, column, {search: 'applied', order: 'applied'} ).flatten();
		var cell = dt.cell( cells[ row ] );

		if ( lastFocus ) {
			// Don't trigger a refocus on the same cell
			if ( lastFocus.node === cell.node() ) {
				this._emitEvent( 'key-refocus', [ this.s.dt, cell, originalEvent || null ] );
				return;
			}

			// Otherwise blur the old focus
			this._blur();
		}

		var node = $( cell.node() );
		node.addClass( this.c.className );

		this._updateFixedColumns(column);

		// Shift viewpoint and page to make cell visible
		if ( shift === undefined || shift === true ) {
			this._scroll( $(window), $(document.body), node, 'offset' );

			var bodyParent = dt.table().body().parentNode;
			if ( bodyParent !== dt.table().header().parentNode ) {
				var parent = $(bodyParent.parentNode);

				this._scroll( parent, parent, node, 'position' );
			}
		}

		// Event and finish
		this.s.lastFocus = {
			cell: cell,
			node: cell.node(),
			relative: {
				row: dt.rows( { page: 'current' } ).indexes().indexOf( cell.index().row ),
				column: cell.index().column
			}
		};

		this._emitEvent( 'key-focus', [ this.s.dt, cell, originalEvent || null ] );
		dt.state.save();
	},


	/**
	 * Handle key press
	 *
	 * @param  {object} e Event
	 * @private
	 */
	_key: function ( e )
	{
		// If we are waiting for a draw to happen from another key event, then
		// do nothing for this new key press.
		if ( this.s.waitingForDraw ) {
			e.preventDefault();
			return;
		}

		var enable = this.s.enable;
		var navEnable = enable === true || enable === 'navigation-only';
		if ( ! enable ) {
			return;
		}

		if ( e.ctrlKey && e.keyCode === 67 ) { // c
			this._clipboardCopy();
			return;
		}

		if ( e.keyCode === 0 || e.ctrlKey || e.metaKey || e.altKey ) {
			return;
		}

		// If not focused, then there is no key action to take
		var lastFocus = this.s.lastFocus;
		if ( ! lastFocus ) {
			return;
		}

		var that = this;
		var dt = this.s.dt;

		// If we are not listening for this key, do nothing
		if ( this.c.keys && $.inArray( e.keyCode, this.c.keys ) === -1 ) {
			return;
		}

		switch( e.keyCode ) {
			case 9: // tab
				// `enable` can be tab-only
				this._shift( e, e.shiftKey ? 'left' : 'right', true );
				break;

			case 27: // esc
				if ( this.s.blurable && enable === true ) {
					this._blur();
				}
				break;

			case 33: // page up (previous page)
			case 34: // page down (next page)
				if ( navEnable ) {
					e.preventDefault();

					dt
						.page( e.keyCode === 33 ? 'previous' : 'next' )
						.draw( false );
				}
				break;

			case 35: // end (end of current page)
			case 36: // home (start of current page)
				if ( navEnable ) {
					e.preventDefault();
					var indexes = dt.cells( {page: 'current'} ).indexes();
					var colIndexes = this._columns();

					this._focus( dt.cell(
						indexes[ e.keyCode === 35 ? indexes.length-1 : colIndexes[0] ]
					), null, true, e );
				}
				break;

			case 37: // left arrow
				if ( navEnable ) {
					this._shift( e, 'left' );
				}
				break;

			case 38: // up arrow
				if ( navEnable ) {
					this._shift( e, 'up' );
				}
				break;

			case 39: // right arrow
				if ( navEnable ) {
					this._shift( e, 'right' );
				}
				break;

			case 40: // down arrow
				if ( navEnable ) {
					this._shift( e, 'down' );
				}
				break;

			default:
				// Everything else - pass through only when fully enabled
				if ( enable === true ) {
					this._emitEvent( 'key', [ dt, e.keyCode, this.s.lastFocus.cell, e ] );
				}
				break;
		}
	},


	/**
	 * Scroll a container to make a cell visible in it. This can be used for
	 * both DataTables scrolling and native window scrolling.
	 *
	 * @param  {jQuery} container Scrolling container
	 * @param  {jQuery} scroller  Item being scrolled
	 * @param  {jQuery} cell      Cell in the scroller
	 * @param  {string} posOff    `position` or `offset` - which to use for the
	 *   calculation. `offset` for the document, otherwise `position`
	 * @private
	 */
	_scroll: function ( container, scroller, cell, posOff )
	{
		var offset = cell[posOff]();
		var height = cell.outerHeight();
		var width = cell.outerWidth();

		var scrollTop = scroller.scrollTop();
		var scrollLeft = scroller.scrollLeft();
		var containerHeight = container.height();
		var containerWidth = container.width();

		// If Scroller is being used, the table can be `position: absolute` and that
		// needs to be taken account of in the offset. If no Scroller, this will be 0
		if ( posOff === 'position' ) {
			offset.top += parseInt( cell.closest('table').css('top'), 10 );
		}

		// Top correction
		if ( offset.top < scrollTop ) {
			scroller.scrollTop( offset.top );
		}

		// Left correction
		if ( offset.left < scrollLeft ) {
			scroller.scrollLeft( offset.left );
		}

		// Bottom correction
		if ( offset.top + height > scrollTop + containerHeight && height < containerHeight ) {
			scroller.scrollTop( offset.top + height - containerHeight );
		}

		// Right correction
		if ( offset.left + width > scrollLeft + containerWidth && width < containerWidth ) {
			scroller.scrollLeft( offset.left + width - containerWidth );
		}
	},


	/**
	 * Calculate a single offset movement in the table - up, down, left and
	 * right and then perform the focus if possible
	 *
	 * @param  {object}  e           Event object
	 * @param  {string}  direction   Movement direction
	 * @param  {boolean} keyBlurable `true` if the key press can result in the
	 *   table being blurred. This is so arrow keys won't blur the table, but
	 *   tab will.
	 * @private
	 */
	_shift: function ( e, direction, keyBlurable )
	{
		var that         = this;
		var dt           = this.s.dt;
		var pageInfo     = dt.page.info();
		var rows         = pageInfo.recordsDisplay;
		var currentCell  = this.s.lastFocus.cell;
		var columns      = this._columns();

		if ( ! currentCell ) {
			return;
		}

		var currRow = dt
			.rows( { filter: 'applied', order: 'applied' } )
			.indexes()
			.indexOf( currentCell.index().row );

		// When server-side processing, `rows().indexes()` only gives the rows
		// that are available at the client-side, so we need to normalise the
		// row's current position by the display start point
		if ( pageInfo.serverSide ) {
			currRow += pageInfo.start;
		}

		var currCol = dt
			.columns( columns )
			.indexes()
			.indexOf( currentCell.index().column );

		var
			row = currRow,
			column = columns[ currCol ]; // row is the display, column is an index

		if ( direction === 'right' ) {
			if ( currCol >= columns.length - 1 ) {
				row++;
				column = columns[0];
			}
			else {
				column = columns[ currCol+1 ];
			}
		}
		else if ( direction === 'left' ) {
			if ( currCol === 0 ) {
				row--;
				column = columns[ columns.length - 1 ];
			}
			else {
				column = columns[ currCol-1 ];
			}
		}
		else if ( direction === 'up' ) {
			row--;
		}
		else if ( direction === 'down' ) {
			row++;
		}

		if ( row >= 0 && row < rows && $.inArray( column, columns ) !== -1
		) {
			e.preventDefault();

			this._focus( row, column, true, e );
		}
		else if ( ! keyBlurable || ! this.c.blurable ) {
			// No new focus, but if the table isn't blurable, then don't loose
			// focus
			e.preventDefault();
		}
		else {
			this._blur();
		}
	},


	/**
	 * Create a hidden input element that can receive focus on behalf of the
	 * table
	 *
	 * @private
	 */
	_tabInput: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var tabIndex = this.c.tabIndex !== null ?
			this.c.tabIndex :
			dt.settings()[0].iTabIndex;

		if ( tabIndex == -1 ) {
			return;
		}

		var div = $('<div><input type="text" tabindex="'+tabIndex+'"/></div>')
			.css( {
				position: 'absolute',
				height: 1,
				width: 0,
				overflow: 'hidden'
			} )
			.insertBefore( dt.table().node() );

		div.children().on( 'focus', function (e) {
			if ( dt.cell(':eq(0)', {page: 'current'}).any() ) {
				that._focus( dt.cell(':eq(0)', '0:visible', {page: 'current'}), null, true, e );
			}
		} );
	},

	/**
	 * Update fixed columns if they are enabled and if the cell we are
	 * focusing is inside a fixed column
	 * @param  {integer} column Index of the column being changed
	 * @private
	 */
	_updateFixedColumns: function( column )
	{
		var dt = this.s.dt;
		var settings = dt.settings()[0];

		if ( settings._oFixedColumns ) {
			var leftCols = settings._oFixedColumns.s.iLeftColumns;
			var rightCols = settings.aoColumns.length - settings._oFixedColumns.s.iRightColumns;

			if (column < leftCols || column >= rightCols) {
				dt.fixedColumns().update();
			}
		}
	}
} );


/**
 * KeyTable default settings for initialisation
 *
 * @namespace
 * @name KeyTable.defaults
 * @static
 */
KeyTable.defaults = {
	/**
	 * Can focus be removed from the table
	 * @type {Boolean}
	 */
	blurable: true,

	/**
	 * Class to give to the focused cell
	 * @type {String}
	 */
	className: 'focus',

	/**
	 * Columns that can be focused. This is automatically merged with the
	 * visible columns as only visible columns can gain focus.
	 * @type {String}
	 */
	columns: '', // all

	/**
	 * Editor instance to automatically perform Excel like navigation
	 * @type {Editor}
	 */
	editor: null,

	/**
	 * Option that defines what KeyTable's behaviour will be when used with
	 * Editor's inline editing. Can be `navigation-only` or `tab-only`.
	 * @type {String}
	 */
	editorKeys: 'navigation-only',

	/**
	 * Set if Editor should automatically select the text in the input
	 * @type {Boolean}
	 */
	editAutoSelect: true,

	/**
	 * Control if editing should be activated immediately upon focus
	 * @type {Boolean}
	 */
	editOnFocus: false,

	/**
	 * Select a cell to automatically select on start up. `null` for no
	 * automatic selection
	 * @type {cell-selector}
	 */
	focus: null,

	/**
	 * Array of keys to listen for
	 * @type {null|array}
	 */
	keys: null,

	/**
	 * Tab index for where the table should sit in the document's tab flow
	 * @type {integer|null}
	 */
	tabIndex: null
};



KeyTable.version = "2.3.2";


$.fn.dataTable.KeyTable = KeyTable;
$.fn.DataTable.KeyTable = KeyTable;


DataTable.Api.register( 'cell.blur()', function () {
	return this.iterator( 'table', function (ctx) {
		if ( ctx.keytable ) {
			ctx.keytable.blur();
		}
	} );
} );

DataTable.Api.register( 'cell().focus()', function () {
	return this.iterator( 'cell', function (ctx, row, column) {
		if ( ctx.keytable ) {
			ctx.keytable.focus( row, column );
		}
	} );
} );

DataTable.Api.register( 'keys.disable()', function () {
	return this.iterator( 'table', function (ctx) {
		if ( ctx.keytable ) {
			ctx.keytable.enable( false );
		}
	} );
} );

DataTable.Api.register( 'keys.enable()', function ( opts ) {
	return this.iterator( 'table', function (ctx) {
		if ( ctx.keytable ) {
			ctx.keytable.enable( opts === undefined ? true : opts );
		}
	} );
} );

// Cell selector
DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var focused = opts.focused;
	var kt = settings.keytable;
	var out = [];

	if ( ! kt || focused === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		if ( (focused === true &&  kt.focused( cells[i] ) ) ||
			 (focused === false && ! kt.focused( cells[i] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );


// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.dtk', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.keys;
	var defaults = DataTable.defaults.keys;

	if ( init || defaults ) {
		var opts = $.extend( {}, defaults, init );

		if ( init !== false ) {
			new KeyTable( settings, opts  );
		}
	}
} );


return KeyTable;
}));


/*! Responsive 2.2.1
 * 2014-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     Responsive
 * @description Responsive tables plug-in for DataTables
 * @version     2.2.1
 * @file        dataTables.responsive.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2014-2017 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/**
 * Responsive is a plug-in for the DataTables library that makes use of
 * DataTables' ability to change the visibility of columns, changing the
 * visibility of columns so the displayed columns fit into the table container.
 * The end result is that complex tables will be dynamically adjusted to fit
 * into the viewport, be it on a desktop, tablet or mobile browser.
 *
 * Responsive for DataTables has two modes of operation, which can used
 * individually or combined:
 *
 * * Class name based control - columns assigned class names that match the
 *   breakpoint logic can be shown / hidden as required for each breakpoint.
 * * Automatic control - columns are automatically hidden when there is no
 *   room left to display them. Columns removed from the right.
 *
 * In additional to column visibility control, Responsive also has built into
 * options to use DataTables' child row display to show / hide the information
 * from the table that has been hidden. There are also two modes of operation
 * for this child row display:
 *
 * * Inline - when the control element that the user can use to show / hide
 *   child rows is displayed inside the first column of the table.
 * * Column - where a whole column is dedicated to be the show / hide control.
 *
 * Initialisation of Responsive is performed by:
 *
 * * Adding the class `responsive` or `dt-responsive` to the table. In this case
 *   Responsive will automatically be initialised with the default configuration
 *   options when the DataTable is created.
 * * Using the `responsive` option in the DataTables configuration options. This
 *   can also be used to specify the configuration options, or simply set to
 *   `true` to use the defaults.
 *
 *  @class
 *  @param {object} settings DataTables settings object for the host table
 *  @param {object} [opts] Configuration options
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.10.3+
 *
 *  @example
 *      $('#example').DataTable( {
 *        responsive: true
 *      } );
 *    } );
 */
var Responsive = function ( settings, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.10' ) ) {
		throw 'DataTables Responsive requires DataTables 1.10.10 or newer';
	}

	this.s = {
		dt: new DataTable.Api( settings ),
		columns: [],
		current: []
	};

	// Check if responsive has already been initialised on this table
	if ( this.s.dt.settings()[0].responsive ) {
		return;
	}

	// details is an object, but for simplicity the user can give it as a string
	// or a boolean
	if ( opts && typeof opts.details === 'string' ) {
		opts.details = { type: opts.details };
	}
	else if ( opts && opts.details === false ) {
		opts.details = { type: false };
	}
	else if ( opts && opts.details === true ) {
		opts.details = { type: 'inline' };
	}

	this.c = $.extend( true, {}, Responsive.defaults, DataTable.defaults.responsive, opts );
	settings.responsive = this;
	this._constructor();
};

$.extend( Responsive.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the Responsive instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtPrivateSettings = dt.settings()[0];
		var oldWindowWidth = $(window).width();

		dt.settings()[0]._responsive = this;

		// Use DataTables' throttle function to avoid processor thrashing on
		// resize
		$(window).on( 'resize.dtr orientationchange.dtr', DataTable.util.throttle( function () {
			// iOS has a bug whereby resize can fire when only scrolling
			// See: http://stackoverflow.com/questions/8898412
			var width = $(window).width();

			if ( width !== oldWindowWidth ) {
				that._resize();
				oldWindowWidth = width;
			}
		} ) );

		// DataTables doesn't currently trigger an event when a row is added, so
		// we need to hook into its private API to enforce the hidden rows when
		// new data is added
		dtPrivateSettings.oApi._fnCallbackReg( dtPrivateSettings, 'aoRowCreatedCallback', function (tr, data, idx) {
			if ( $.inArray( false, that.s.current ) !== -1 ) {
				$('>td, >th', tr).each( function ( i ) {
					var idx = dt.column.index( 'toData', i );

					if ( that.s.current[idx] === false ) {
						$(this).css('display', 'none');
					}
				} );
			}
		} );

		// Destroy event handler
		dt.on( 'destroy.dtr', function () {
			dt.off( '.dtr' );
			$( dt.table().body() ).off( '.dtr' );
			$(window).off( 'resize.dtr orientationchange.dtr' );

			// Restore the columns that we've hidden
			$.each( that.s.current, function ( i, val ) {
				if ( val === false ) {
					that._setColumnVis( i, true );
				}
			} );
		} );

		// Reorder the breakpoints array here in case they have been added out
		// of order
		this.c.breakpoints.sort( function (a, b) {
			return a.width < b.width ? 1 :
				a.width > b.width ? -1 : 0;
		} );

		this._classLogic();
		this._resizeAuto();

		// Details handler
		var details = this.c.details;

		if ( details.type !== false ) {
			that._detailsInit();

			// DataTables will trigger this event on every column it shows and
			// hides individually
			dt.on( 'column-visibility.dtr', function (e, ctx, col, vis, recalc) {
				if ( recalc ) {
					that._classLogic();
					that._resizeAuto();
					that._resize();
				}
			} );

			// Redraw the details box on each draw which will happen if the data
			// has changed. This is used until DataTables implements a native
			// `updated` event for rows
			dt.on( 'draw.dtr', function () {
				that._redrawChildren();
			} );

			$(dt.table().node()).addClass( 'dtr-'+details.type );
		}

		dt.on( 'column-reorder.dtr', function (e, settings, details) {
			that._classLogic();
			that._resizeAuto();
			that._resize();
		} );

		// Change in column sizes means we need to calc
		dt.on( 'column-sizing.dtr', function () {
			that._resizeAuto();
			that._resize();
		});

		// On Ajax reload we want to reopen any child rows which are displayed
		// by responsive
		dt.on( 'preXhr.dtr', function () {
			var rowIds = [];
			dt.rows().every( function () {
				if ( this.child.isShown() ) {
					rowIds.push( this.id(true) );
				}
			} );

			dt.one( 'draw.dtr', function () {
				that._resizeAuto();
				that._resize();

				dt.rows( rowIds ).every( function () {
					that._detailsDisplay( this, false );
				} );
			} );
		});

		dt.on( 'init.dtr', function (e, settings, details) {
			that._resizeAuto();
			that._resize();

			// If columns were hidden, then DataTables needs to adjust the
			// column sizing
			if ( $.inArray( false, that.s.current ) ) {
				dt.columns.adjust();
			}
		} );

		// First pass - draw the table for the current viewport size
		this._resize();
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Calculate the visibility for the columns in a table for a given
	 * breakpoint. The result is pre-determined based on the class logic if
	 * class names are used to control all columns, but the width of the table
	 * is also used if there are columns which are to be automatically shown
	 * and hidden.
	 *
	 * @param  {string} breakpoint Breakpoint name to use for the calculation
	 * @return {array} Array of boolean values initiating the visibility of each
	 *   column.
	 *  @private
	 */
	_columnsVisiblity: function ( breakpoint )
	{
		var dt = this.s.dt;
		var columns = this.s.columns;
		var i, ien;

		// Create an array that defines the column ordering based first on the
		// column's priority, and secondly the column index. This allows the
		// columns to be removed from the right if the priority matches
		var order = columns
			.map( function ( col, idx ) {
				return {
					columnIdx: idx,
					priority: col.priority
				};
			} )
			.sort( function ( a, b ) {
				if ( a.priority !== b.priority ) {
					return a.priority - b.priority;
				}
				return a.columnIdx - b.columnIdx;
			} );

		// Class logic - determine which columns are in this breakpoint based
		// on the classes. If no class control (i.e. `auto`) then `-` is used
		// to indicate this to the rest of the function
		var display = $.map( columns, function ( col ) {
			return col.auto && col.minWidth === null ?
				false :
				col.auto === true ?
					'-' :
					$.inArray( breakpoint, col.includeIn ) !== -1;
		} );

		// Auto column control - first pass: how much width is taken by the
		// ones that must be included from the non-auto columns
		var requiredWidth = 0;
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( display[i] === true ) {
				requiredWidth += columns[i].minWidth;
			}
		}

		// Second pass, use up any remaining width for other columns. For
		// scrolling tables we need to subtract the width of the scrollbar. It
		// may not be requires which makes this sub-optimal, but it would
		// require another full redraw to make complete use of those extra few
		// pixels
		var scrolling = dt.settings()[0].oScroll;
		var bar = scrolling.sY || scrolling.sX ? scrolling.iBarWidth : 0;
		var widthAvailable = dt.table().container().offsetWidth - bar;
		var usedWidth = widthAvailable - requiredWidth;

		// Control column needs to always be included. This makes it sub-
		// optimal in terms of using the available with, but to stop layout
		// thrashing or overflow. Also we need to account for the control column
		// width first so we know how much width is available for the other
		// columns, since the control column might not be the first one shown
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				usedWidth -= columns[i].minWidth;
			}
		}

		// Allow columns to be shown (counting by priority and then right to
		// left) until we run out of room
		var empty = false;
		for ( i=0, ien=order.length ; i<ien ; i++ ) {
			var colIdx = order[i].columnIdx;

			if ( display[colIdx] === '-' && ! columns[colIdx].control && columns[colIdx].minWidth ) {
				// Once we've found a column that won't fit we don't let any
				// others display either, or columns might disappear in the
				// middle of the table
				if ( empty || usedWidth - columns[colIdx].minWidth < 0 ) {
					empty = true;
					display[colIdx] = false;
				}
				else {
					display[colIdx] = true;
				}

				usedWidth -= columns[colIdx].minWidth;
			}
		}

		// Determine if the 'control' column should be shown (if there is one).
		// This is the case when there is a hidden column (that is not the
		// control column). The two loops look inefficient here, but they are
		// trivial and will fly through. We need to know the outcome from the
		// first , before the action in the second can be taken
		var showControl = false;

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( ! columns[i].control && ! columns[i].never && ! display[i] ) {
				showControl = true;
				break;
			}
		}

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				display[i] = showControl;
			}
		}

		// Finally we need to make sure that there is at least one column that
		// is visible
		if ( $.inArray( true, display ) === -1 ) {
			display[0] = true;
		}

		return display;
	},


	/**
	 * Create the internal `columns` array with information about the columns
	 * for the table. This includes determining which breakpoints the column
	 * will appear in, based upon class names in the column, which makes up the
	 * vast majority of this method.
	 *
	 * @private
	 */
	_classLogic: function ()
	{
		var that = this;
		var calc = {};
		var breakpoints = this.c.breakpoints;
		var dt = this.s.dt;
		var columns = dt.columns().eq(0).map( function (i) {
			var column = this.column(i);
			var className = column.header().className;
			var priority = dt.settings()[0].aoColumns[i].responsivePriority;

			if ( priority === undefined ) {
				var dataPriority = $(column.header()).data('priority');

				priority = dataPriority !== undefined ?
					dataPriority * 1 :
					10000;
			}

			return {
				className: className,
				includeIn: [],
				auto:      false,
				control:   false,
				never:     className.match(/\bnever\b/) ? true : false,
				priority:  priority
			};
		} );

		// Simply add a breakpoint to `includeIn` array, ensuring that there are
		// no duplicates
		var add = function ( colIdx, name ) {
			var includeIn = columns[ colIdx ].includeIn;

			if ( $.inArray( name, includeIn ) === -1 ) {
				includeIn.push( name );
			}
		};

		var column = function ( colIdx, name, operator, matched ) {
			var size, i, ien;

			if ( ! operator ) {
				columns[ colIdx ].includeIn.push( name );
			}
			else if ( operator === 'max-' ) {
				// Add this breakpoint and all smaller
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width <= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'min-' ) {
				// Add this breakpoint and all larger
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width >= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'not-' ) {
				// Add all but this breakpoint
				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].name.indexOf( matched ) === -1 ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
		};

		// Loop over each column and determine if it has a responsive control
		// class
		columns.each( function ( col, i ) {
			var classNames = col.className.split(' ');
			var hasClass = false;

			// Split the class name up so multiple rules can be applied if needed
			for ( var k=0, ken=classNames.length ; k<ken ; k++ ) {
				var className = $.trim( classNames[k] );

				if ( className === 'all' ) {
					// Include in all
					hasClass = true;
					col.includeIn = $.map( breakpoints, function (a) {
						return a.name;
					} );
					return;
				}
				else if ( className === 'none' || col.never ) {
					// Include in none (default) and no auto
					hasClass = true;
					return;
				}
				else if ( className === 'control' ) {
					// Special column that is only visible, when one of the other
					// columns is hidden. This is used for the details control
					hasClass = true;
					col.control = true;
					return;
				}

				$.each( breakpoints, function ( j, breakpoint ) {
					// Does this column have a class that matches this breakpoint?
					var brokenPoint = breakpoint.name.split('-');
					var re = new RegExp( '(min\\-|max\\-|not\\-)?('+brokenPoint[0]+')(\\-[_a-zA-Z0-9])?' );
					var match = className.match( re );

					if ( match ) {
						hasClass = true;

						if ( match[2] === brokenPoint[0] && match[3] === '-'+brokenPoint[1] ) {
							// Class name matches breakpoint name fully
							column( i, breakpoint.name, match[1], match[2]+match[3] );
						}
						else if ( match[2] === brokenPoint[0] && ! match[3] ) {
							// Class name matched primary breakpoint name with no qualifier
							column( i, breakpoint.name, match[1], match[2] );
						}
					}
				} );
			}

			// If there was no control class, then automatic sizing is used
			if ( ! hasClass ) {
				col.auto = true;
			}
		} );

		this.s.columns = columns;
	},


	/**
	 * Show the details for the child row
	 *
	 * @param  {DataTables.Api} row    API instance for the row
	 * @param  {boolean}        update Update flag
	 * @private
	 */
	_detailsDisplay: function ( row, update )
	{
		var that = this;
		var dt = this.s.dt;
		var details = this.c.details;

		if ( details && details.type !== false ) {
			var res = details.display( row, update, function () {
				return details.renderer(
					dt, row[0], that._detailsObj(row[0])
				);
			} );

			if ( res === true || res === false ) {
				$(dt.table().node()).triggerHandler( 'responsive-display.dt', [dt, row, res, update] );
			}
		}
	},


	/**
	 * Initialisation for the details handler
	 *
	 * @private
	 */
	_detailsInit: function ()
	{
		var that    = this;
		var dt      = this.s.dt;
		var details = this.c.details;

		// The inline type always uses the first child as the target
		if ( details.type === 'inline' ) {
			details.target = 'td:first-child, th:first-child';
		}

		// Keyboard accessibility
		dt.on( 'draw.dtr', function () {
			that._tabIndexes();
		} );
		that._tabIndexes(); // Initial draw has already happened

		$( dt.table().body() ).on( 'keyup.dtr', 'td, th', function (e) {
			if ( e.keyCode === 13 && $(this).data('dtr-keyboard') ) {
				$(this).click();
			}
		} );

		// type.target can be a string jQuery selector or a column index
		var target   = details.target;
		var selector = typeof target === 'string' ? target : 'td, th';

		// Click handler to show / hide the details rows when they are available
		$( dt.table().body() )
			.on( 'click.dtr mousedown.dtr mouseup.dtr', selector, function (e) {
				// If the table is not collapsed (i.e. there is no hidden columns)
				// then take no action
				if ( ! $(dt.table().node()).hasClass('collapsed' ) ) {
					return;
				}

				// Check that the row is actually a DataTable's controlled node
				if ( $.inArray( $(this).closest('tr').get(0), dt.rows().nodes().toArray() ) === -1 ) {
					return;
				}

				// For column index, we determine if we should act or not in the
				// handler - otherwise it is already okay
				if ( typeof target === 'number' ) {
					var targetIdx = target < 0 ?
						dt.columns().eq(0).length + target :
						target;

					if ( dt.cell( this ).index().column !== targetIdx ) {
						return;
					}
				}

				// $().closest() includes itself in its check
				var row = dt.row( $(this).closest('tr') );

				// Check event type to do an action
				if ( e.type === 'click' ) {
					// The renderer is given as a function so the caller can execute it
					// only when they need (i.e. if hiding there is no point is running
					// the renderer)
					that._detailsDisplay( row, false );
				}
				else if ( e.type === 'mousedown' ) {
					// For mouse users, prevent the focus ring from showing
					$(this).css('outline', 'none');
				}
				else if ( e.type === 'mouseup' ) {
					// And then re-allow at the end of the click
					$(this).blur().css('outline', '');
				}
			} );
	},


	/**
	 * Get the details to pass to a renderer for a row
	 * @param  {int} rowIdx Row index
	 * @private
	 */
	_detailsObj: function ( rowIdx )
	{
		var that = this;
		var dt = this.s.dt;

		return $.map( this.s.columns, function( col, i ) {
			// Never and control columns should not be passed to the renderer
			if ( col.never || col.control ) {
				return;
			}

			return {
				title:       dt.settings()[0].aoColumns[ i ].sTitle,
				data:        dt.cell( rowIdx, i ).render( that.c.orthogonal ),
				hidden:      dt.column( i ).visible() && !that.s.current[ i ],
				columnIndex: i,
				rowIndex:    rowIdx
			};
		} );
	},


	/**
	 * Find a breakpoint object from a name
	 *
	 * @param  {string} name Breakpoint name to find
	 * @return {object}      Breakpoint description object
	 * @private
	 */
	_find: function ( name )
	{
		var breakpoints = this.c.breakpoints;

		for ( var i=0, ien=breakpoints.length ; i<ien ; i++ ) {
			if ( breakpoints[i].name === name ) {
				return breakpoints[i];
			}
		}
	},


	/**
	 * Re-create the contents of the child rows as the display has changed in
	 * some way.
	 *
	 * @private
	 */
	_redrawChildren: function ()
	{
		var that = this;
		var dt = this.s.dt;

		dt.rows( {page: 'current'} ).iterator( 'row', function ( settings, idx ) {
			var row = dt.row( idx );

			that._detailsDisplay( dt.row( idx ), true );
		} );
	},


	/**
	 * Alter the table display for a resized viewport. This involves first
	 * determining what breakpoint the window currently is in, getting the
	 * column visibilities to apply and then setting them.
	 *
	 * @private
	 */
	_resize: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var width = $(window).width();
		var breakpoints = this.c.breakpoints;
		var breakpoint = breakpoints[0].name;
		var columns = this.s.columns;
		var i, ien;
		var oldVis = this.s.current.slice();

		// Determine what breakpoint we are currently at
		for ( i=breakpoints.length-1 ; i>=0 ; i-- ) {
			if ( width <= breakpoints[i].width ) {
				breakpoint = breakpoints[i].name;
				break;
			}
		}
		
		// Show the columns for that break point
		var columnsVis = this._columnsVisiblity( breakpoint );
		this.s.current = columnsVis;

		// Set the class before the column visibility is changed so event
		// listeners know what the state is. Need to determine if there are
		// any columns that are not visible but can be shown
		var collapsedClass = false;
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columnsVis[i] === false && ! columns[i].never && ! columns[i].control ) {
				collapsedClass = true;
				break;
			}
		}

		$( dt.table().node() ).toggleClass( 'collapsed', collapsedClass );

		var changed = false;
		var visible = 0;

		dt.columns().eq(0).each( function ( colIdx, i ) {
			if ( columnsVis[i] === true ) {
				visible++;
			}

			if ( columnsVis[i] !== oldVis[i] ) {
				changed = true;
				that._setColumnVis( colIdx, columnsVis[i] );
			}
		} );

		if ( changed ) {
			this._redrawChildren();

			// Inform listeners of the change
			$(dt.table().node()).trigger( 'responsive-resize.dt', [dt, this.s.current] );

			// If no records, update the "No records" display element
			if ( dt.page.info().recordsDisplay === 0 ) {
				$('td', dt.table().body()).eq(0).attr('colspan', visible);
			}
		}
	},


	/**
	 * Determine the width of each column in the table so the auto column hiding
	 * has that information to work with. This method is never going to be 100%
	 * perfect since column widths can change slightly per page, but without
	 * seriously compromising performance this is quite effective.
	 *
	 * @private
	 */
	_resizeAuto: function ()
	{
		var dt = this.s.dt;
		var columns = this.s.columns;

		// Are we allowed to do auto sizing?
		if ( ! this.c.auto ) {
			return;
		}

		// Are there any columns that actually need auto-sizing, or do they all
		// have classes defined
		if ( $.inArray( true, $.map( columns, function (c) { return c.auto; } ) ) === -1 ) {
			return;
		}

		// Need to restore all children. They will be reinstated by a re-render
		if ( ! $.isEmptyObject( _childNodeStore ) ) {
			$.each( _childNodeStore, function ( key ) {
				var idx = key.split('-');

				_childNodesRestore( dt, idx[0]*1, idx[1]*1 );
			} );
		}

		// Clone the table with the current data in it
		var tableWidth   = dt.table().node().offsetWidth;
		var columnWidths = dt.columns;
		var clonedTable  = dt.table().node().cloneNode( false );
		var clonedHeader = $( dt.table().header().cloneNode( false ) ).appendTo( clonedTable );
		var clonedBody   = $( dt.table().body() ).clone( false, false ).empty().appendTo( clonedTable ); // use jQuery because of IE8

		// Header
		var headerCells = dt.columns()
			.header()
			.filter( function (idx) {
				return dt.column(idx).visible();
			} )
			.to$()
			.clone( false )
			.css( 'display', 'table-cell' )
			.css( 'min-width', 0 );

		// Body rows - we don't need to take account of DataTables' column
		// visibility since we implement our own here (hence the `display` set)
		$(clonedBody)
			.append( $(dt.rows( { page: 'current' } ).nodes()).clone( false ) )
			.find( 'th, td' ).css( 'display', '' );

		// Footer
		var footer = dt.table().footer();
		if ( footer ) {
			var clonedFooter = $( footer.cloneNode( false ) ).appendTo( clonedTable );
			var footerCells = dt.columns()
				.footer()
				.filter( function (idx) {
					return dt.column(idx).visible();
				} )
				.to$()
				.clone( false )
				.css( 'display', 'table-cell' );

			$('<tr/>')
				.append( footerCells )
				.appendTo( clonedFooter );
		}

		$('<tr/>')
			.append( headerCells )
			.appendTo( clonedHeader );

		// In the inline case extra padding is applied to the first column to
		// give space for the show / hide icon. We need to use this in the
		// calculation
		if ( this.c.details.type === 'inline' ) {
			$(clonedTable).addClass( 'dtr-inline collapsed' );
		}
		
		// It is unsafe to insert elements with the same name into the DOM
		// multiple times. For example, cloning and inserting a checked radio
		// clears the chcecked state of the original radio.
		$( clonedTable ).find( '[name]' ).removeAttr( 'name' );
		
		var inserted = $('<div/>')
			.css( {
				width: 1,
				height: 1,
				overflow: 'hidden',
				clear: 'both'
			} )
			.append( clonedTable );

		inserted.insertBefore( dt.table().node() );

		// The cloned header now contains the smallest that each column can be
		headerCells.each( function (i) {
			var idx = dt.column.index( 'fromVisible', i );
			columns[ idx ].minWidth =  this.offsetWidth || 0;
		} );

		inserted.remove();
	},

	/**
	 * Set a column's visibility.
	 *
	 * We don't use DataTables' column visibility controls in order to ensure
	 * that column visibility can Responsive can no-exist. Since only IE8+ is
	 * supported (and all evergreen browsers of course) the control of the
	 * display attribute works well.
	 *
	 * @param {integer} col      Column index
	 * @param {boolean} showHide Show or hide (true or false)
	 * @private
	 */
	_setColumnVis: function ( col, showHide )
	{
		var dt = this.s.dt;
		var display = showHide ? '' : 'none'; // empty string will remove the attr

		$( dt.column( col ).header() ).css( 'display', display );
		$( dt.column( col ).footer() ).css( 'display', display );
		dt.column( col ).nodes().to$().css( 'display', display );

		// If the are child nodes stored, we might need to reinsert them
		if ( ! $.isEmptyObject( _childNodeStore ) ) {
			dt.cells( null, col ).indexes().each( function (idx) {
				_childNodesRestore( dt, idx.row, idx.column );
			} );
		}
	},


	/**
	 * Update the cell tab indexes for keyboard accessibility. This is called on
	 * every table draw - that is potentially inefficient, but also the least
	 * complex option given that column visibility can change on the fly. Its a
	 * shame user-focus was removed from CSS 3 UI, as it would have solved this
	 * issue with a single CSS statement.
	 *
	 * @private
	 */
	_tabIndexes: function ()
	{
		var dt = this.s.dt;
		var cells = dt.cells( { page: 'current' } ).nodes().to$();
		var ctx = dt.settings()[0];
		var target = this.c.details.target;

		cells.filter( '[data-dtr-keyboard]' ).removeData( '[data-dtr-keyboard]' );

		var selector = typeof target === 'number' ?
			':eq('+target+')' :
			target;

		// This is a bit of a hack - we need to limit the selected nodes to just
		// those of this table
		if ( selector === 'td:first-child, th:first-child' ) {
			selector = '>td:first-child, >th:first-child';
		}

		$( selector, dt.rows( { page: 'current' } ).nodes() )
			.attr( 'tabIndex', ctx.iTabIndex )
			.data( 'dtr-keyboard', 1 );
	}
} );


/**
 * List of default breakpoints. Each item in the array is an object with two
 * properties:
 *
 * * `name` - the breakpoint name.
 * * `width` - the breakpoint width
 *
 * @name Responsive.breakpoints
 * @static
 */
Responsive.breakpoints = [
	{ name: 'desktop',  width: Infinity },
	{ name: 'tablet-l', width: 1024 },
	{ name: 'tablet-p', width: 768 },
	{ name: 'mobile-l', width: 480 },
	{ name: 'mobile-p', width: 320 }
];


/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.display = {
	childRow: function ( row, update, render ) {
		if ( update ) {
			if ( $(row.node()).hasClass('parent') ) {
				row.child( render(), 'child' ).show();

				return true;
			}
		}
		else {
			if ( ! row.child.isShown()  ) {
				row.child( render(), 'child' ).show();
				$( row.node() ).addClass( 'parent' );

				return true;
			}
			else {
				row.child( false );
				$( row.node() ).removeClass( 'parent' );

				return false;
			}
		}
	},

	childRowImmediate: function ( row, update, render ) {
		if ( (! update && row.child.isShown()) || ! row.responsive.hasHidden() ) {
			// User interaction and the row is show, or nothing to show
			row.child( false );
			$( row.node() ).removeClass( 'parent' );

			return false;
		}
		else {
			// Display
			row.child( render(), 'child' ).show();
			$( row.node() ).addClass( 'parent' );

			return true;
		}
	},

	// This is a wrapper so the modal options for Bootstrap and jQuery UI can
	// have options passed into them. This specific one doesn't need to be a
	// function but it is for consistency in the `modal` name
	modal: function ( options ) {
		return function ( row, update, render ) {
			if ( ! update ) {
				// Show a modal
				var close = function () {
					modal.remove(); // will tidy events for us
					$(document).off( 'keypress.dtr' );
				};

				var modal = $('<div class="dtr-modal"/>')
					.append( $('<div class="dtr-modal-display"/>')
						.append( $('<div class="dtr-modal-content"/>')
							.append( render() )
						)
						.append( $('<div class="dtr-modal-close">&times;</div>' )
							.click( function () {
								close();
							} )
						)
					)
					.append( $('<div class="dtr-modal-background"/>')
						.click( function () {
							close();
						} )
					)
					.appendTo( 'body' );

				$(document).on( 'keyup.dtr', function (e) {
					if ( e.keyCode === 27 ) {
						e.stopPropagation();

						close();
					}
				} );
			}
			else {
				$('div.dtr-modal-content')
					.empty()
					.append( render() );
			}

			if ( options && options.header ) {
				$('div.dtr-modal-content').prepend(
					'<h2>'+options.header( row )+'</h2>'
				);
			}
		};
	}
};


var _childNodeStore = {};

function _childNodes( dt, row, col ) {
	var name = row+'-'+col;

	if ( _childNodeStore[ name ] ) {
		return _childNodeStore[ name ];
	}

	// https://jsperf.com/childnodes-array-slice-vs-loop
	var nodes = [];
	var children = dt.cell( row, col ).node().childNodes;
	for ( var i=0, ien=children.length ; i<ien ; i++ ) {
		nodes.push( children[i] );
	}

	_childNodeStore[ name ] = nodes;

	return nodes;
}

function _childNodesRestore( dt, row, col ) {
	var name = row+'-'+col;

	if ( ! _childNodeStore[ name ] ) {
		return;
	}

	var node = dt.cell( row, col ).node();
	var store = _childNodeStore[ name ];
	var parent = store[0].parentNode;
	var parentChildren = parent.childNodes;
	var a = [];

	for ( var i=0, ien=parentChildren.length ; i<ien ; i++ ) {
		a.push( parentChildren[i] );
	}

	for ( var j=0, jen=a.length ; j<jen ; j++ ) {
		node.appendChild( a[j] );
	}

	_childNodeStore[ name ] = undefined;
}


/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.renderer = {
	listHiddenNodes: function () {
		return function ( api, rowIdx, columns ) {
			var ul = $('<ul data-dtr-index="'+rowIdx+'" class="dtr-details"/>');
			var found = false;

			var data = $.each( columns, function ( i, col ) {
				if ( col.hidden ) {
					$(
						'<li data-dtr-index="'+col.columnIndex+'" data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
							'<span class="dtr-title">'+
								col.title+
							'</span> '+
						'</li>'
					)
						.append( $('<span class="dtr-data"/>').append( _childNodes( api, col.rowIndex, col.columnIndex ) ) )// api.cell( col.rowIndex, col.columnIndex ).node().childNodes ) )
						.appendTo( ul );

					found = true;
				}
			} );

			return found ?
				ul :
				false;
		};
	},

	listHidden: function () {
		return function ( api, rowIdx, columns ) {
			var data = $.map( columns, function ( col ) {
				return col.hidden ?
					'<li data-dtr-index="'+col.columnIndex+'" data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
						'<span class="dtr-title">'+
							col.title+
						'</span> '+
						'<span class="dtr-data">'+
							col.data+
						'</span>'+
					'</li>' :
					'';
			} ).join('');

			return data ?
				$('<ul data-dtr-index="'+rowIdx+'" class="dtr-details"/>').append( data ) :
				false;
		}
	},

	tableAll: function ( options ) {
		options = $.extend( {
			tableClass: ''
		}, options );

		return function ( api, rowIdx, columns ) {
			var data = $.map( columns, function ( col ) {
				return '<tr data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
						'<td>'+col.title+':'+'</td> '+
						'<td>'+col.data+'</td>'+
					'</tr>';
			} ).join('');

			return $('<table class="'+options.tableClass+' dtr-details" width="100%"/>').append( data );
		}
	}
};

/**
 * Responsive default settings for initialisation
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.defaults = {
	/**
	 * List of breakpoints for the instance. Note that this means that each
	 * instance can have its own breakpoints. Additionally, the breakpoints
	 * cannot be changed once an instance has been creased.
	 *
	 * @type {Array}
	 * @default Takes the value of `Responsive.breakpoints`
	 */
	breakpoints: Responsive.breakpoints,

	/**
	 * Enable / disable auto hiding calculations. It can help to increase
	 * performance slightly if you disable this option, but all columns would
	 * need to have breakpoint classes assigned to them
	 *
	 * @type {Boolean}
	 * @default  `true`
	 */
	auto: true,

	/**
	 * Details control. If given as a string value, the `type` property of the
	 * default object is set to that value, and the defaults used for the rest
	 * of the object - this is for ease of implementation.
	 *
	 * The object consists of the following properties:
	 *
	 * * `display` - A function that is used to show and hide the hidden details
	 * * `renderer` - function that is called for display of the child row data.
	 *   The default function will show the data from the hidden columns
	 * * `target` - Used as the selector for what objects to attach the child
	 *   open / close to
	 * * `type` - `false` to disable the details display, `inline` or `column`
	 *   for the two control types
	 *
	 * @type {Object|string}
	 */
	details: {
		display: Responsive.display.childRow,

		renderer: Responsive.renderer.listHidden(),

		target: 0,

		type: 'inline'
	},

	/**
	 * Orthogonal data request option. This is used to define the data type
	 * requested when Responsive gets the data to show in the child row.
	 *
	 * @type {String}
	 */
	orthogonal: 'display'
};


/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - work around for a bug in DT... Not documented
Api.register( 'responsive()', function () {
	return this;
} );

Api.register( 'responsive.index()', function ( li ) {
	li = $(li);

	return {
		column: li.data('dtr-index'),
		row:    li.parent().data('dtr-index')
	};
} );

Api.register( 'responsive.rebuild()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._classLogic();
		}
	} );
} );

Api.register( 'responsive.recalc()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._resizeAuto();
			ctx._responsive._resize();
		}
	} );
} );

Api.register( 'responsive.hasHidden()', function () {
	var ctx = this.context[0];

	return ctx._responsive ?
		$.inArray( false, ctx._responsive.s.current ) !== -1 :
		false;
} );

Api.registerPlural( 'columns().responsiveHidden()', 'column().responsiveHidden()', function () {
	return this.iterator( 'column', function ( settings, column ) {
		return settings._responsive ?
			settings._responsive.s.current[ column ] :
			false;
	}, 1 );
} );


/**
 * Version information
 *
 * @name Responsive.version
 * @static
 */
Responsive.version = '2.2.1';


$.fn.dataTable.Responsive = Responsive;
$.fn.DataTable.Responsive = Responsive;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.dtr', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	if ( $(settings.nTable).hasClass( 'responsive' ) ||
		 $(settings.nTable).hasClass( 'dt-responsive' ) ||
		 settings.oInit.responsive ||
		 DataTable.defaults.responsive
	) {
		var init = settings.oInit.responsive;

		if ( init !== false ) {
			new Responsive( settings, $.isPlainObject( init ) ? init : {}  );
		}
	}
} );


return Responsive;
}));


/*! RowReorder 1.2.3
 * 2015-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     RowReorder
 * @description Row reordering extension for DataTables
 * @version     1.2.3
 * @file        dataTables.rowReorder.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2015-2017 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/**
 * RowReorder provides the ability in DataTables to click and drag rows to
 * reorder them. When a row is dropped the data for the rows effected will be
 * updated to reflect the change. Normally this data point should also be the
 * column being sorted upon in the DataTable but this does not need to be the
 * case. RowReorder implements a "data swap" method - so the rows being
 * reordered take the value of the data point from the row that used to occupy
 * the row's new position.
 *
 * Initialisation is done by either:
 *
 * * `rowReorder` parameter in the DataTable initialisation object
 * * `new $.fn.dataTable.RowReorder( table, opts )` after DataTables
 *   initialisation.
 * 
 *  @class
 *  @param {object} settings DataTables settings object for the host table
 *  @param {object} [opts] Configuration options
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.10.7+
 */
var RowReorder = function ( dt, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.8' ) ) {
		throw 'DataTables RowReorder requires DataTables 1.10.8 or newer';
	}

	// User and defaults configuration object
	this.c = $.extend( true, {},
		DataTable.defaults.rowReorder,
		RowReorder.defaults,
		opts
	);

	// Internal settings
	this.s = {
		/** @type {integer} Scroll body top cache */
		bodyTop: null,

		/** @type {DataTable.Api} DataTables' API instance */
		dt: new DataTable.Api( dt ),

		/** @type {function} Data fetch function */
		getDataFn: DataTable.ext.oApi._fnGetObjectDataFn( this.c.dataSrc ),

		/** @type {array} Pixel positions for row insertion calculation */
		middles: null,

		/** @type {Object} Cached dimension information for use in the mouse move event handler */
		scroll: {},

		/** @type {integer} Interval object used for smooth scrolling */
		scrollInterval: null,

		/** @type {function} Data set function */
		setDataFn: DataTable.ext.oApi._fnSetObjectDataFn( this.c.dataSrc ),

		/** @type {Object} Mouse down information */
		start: {
			top: 0,
			left: 0,
			offsetTop: 0,
			offsetLeft: 0,
			nodes: []
		},

		/** @type {integer} Window height cached value */
		windowHeight: 0,

		/** @type {integer} Document outer height cached value */
		documentOuterHeight: 0,

		/** @type {integer} DOM clone outer height cached value */
		domCloneOuterHeight: 0
	};

	// DOM items
	this.dom = {
		/** @type {jQuery} Cloned row being moved around */
		clone: null,

		/** @type {jQuery} DataTables scrolling container */
		dtScroll: $('div.dataTables_scrollBody', this.s.dt.table().container())
	};

	// Check if row reorder has already been initialised on this table
	var settings = this.s.dt.settings()[0];
	var exisiting = settings.rowreorder;
	if ( exisiting ) {
		return exisiting;
	}

	settings.rowreorder = this;
	this._constructor();
};


$.extend( RowReorder.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the RowReorder instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var table = $( dt.table().node() );

		// Need to be able to calculate the row positions relative to the table
		if ( table.css('position') === 'static' ) {
			table.css( 'position', 'relative' );
		}

		// listen for mouse down on the target column - we have to implement
		// this rather than using HTML5 drag and drop as drag and drop doesn't
		// appear to work on table rows at this time. Also mobile browsers are
		// not supported.
		// Use `table().container()` rather than just the table node for IE8 -
		// otherwise it only works once...
		$(dt.table().container()).on( 'mousedown.rowReorder touchstart.rowReorder', this.c.selector, function (e) {
			if ( ! that.c.enable ) {
				return;
			}

			var tr = $(this).closest('tr');
			var row = dt.row( tr );

			// Double check that it is a DataTable row
			if ( row.any() ) {
				that._emitEvent( 'pre-row-reorder', {
					node: row.node(),
					index: row.index()
				} );

				that._mouseDown( e, tr );
				return false;
			}
		} );

		dt.on( 'destroy.rowReorder', function () {
			$(dt.table().container()).off( '.rowReorder' );
			dt.off( '.rowReorder' );
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */
	
	/**
	 * Cache the measurements that RowReorder needs in the mouse move handler
	 * to attempt to speed things up, rather than reading from the DOM.
	 *
	 * @private
	 */
	_cachePositions: function ()
	{
		var dt = this.s.dt;

		// Frustratingly, if we add `position:relative` to the tbody, the
		// position is still relatively to the parent. So we need to adjust
		// for that
		var headerHeight = $( dt.table().node() ).find('thead').outerHeight();

		// Need to pass the nodes through jQuery to get them in document order,
		// not what DataTables thinks it is, since we have been altering the
		// order
		var nodes = $.unique( dt.rows( { page: 'current' } ).nodes().toArray() );
		var tops = $.map( nodes, function ( node, i ) {
			return $(node).position().top - headerHeight;
		} );

		var middles = $.map( tops, function ( top, i ) {
			return tops.length < i-1 ?
				(top + tops[i+1]) / 2 :
				(top + top + $( dt.row( ':last-child' ).node() ).outerHeight() ) / 2;
		} );

		this.s.middles = middles;
		this.s.bodyTop = $( dt.table().body() ).offset().top;
		this.s.windowHeight = $(window).height();
		this.s.documentOuterHeight = $(document).outerHeight();
	},


	/**
	 * Clone a row so it can be floated around the screen
	 *
	 * @param  {jQuery} target Node to be cloned
	 * @private
	 */
	_clone: function ( target )
	{
		var dt = this.s.dt;
		var clone = $( dt.table().node().cloneNode(false) )
			.addClass( 'dt-rowReorder-float' )
			.append('<tbody/>')
			.append( target.clone( false ) );

		// Match the table and column widths - read all sizes before setting
		// to reduce reflows
		var tableWidth = target.outerWidth();
		var tableHeight = target.outerHeight();
		var sizes = target.children().map( function () {
			return $(this).width();
		} );

		clone
			.width( tableWidth )
			.height( tableHeight )
			.find('tr').children().each( function (i) {
				this.style.width = sizes[i]+'px';
			} );

		// Insert into the document to have it floating around
		clone.appendTo( 'body' );

		this.dom.clone = clone;
		this.s.domCloneOuterHeight = clone.outerHeight();
	},


	/**
	 * Update the cloned item's position in the document
	 *
	 * @param  {object} e Event giving the mouse's position
	 * @private
	 */
	_clonePosition: function ( e )
	{
		var start = this.s.start;
		var topDiff = this._eventToPage( e, 'Y' ) - start.top;
		var leftDiff = this._eventToPage( e, 'X' ) - start.left;
		var snap = this.c.snapX;
		var left;
		var top = topDiff + start.offsetTop;

		if ( snap === true ) {
			left = start.offsetLeft;
		}
		else if ( typeof snap === 'number' ) {
			left = start.offsetLeft + snap;
		}
		else {
			left = leftDiff + start.offsetLeft;
		}

		if(top < 0) {
			top = 0
		}
		else if(top + this.s.domCloneOuterHeight > this.s.documentOuterHeight) {
			top = this.s.documentOuterHeight - this.s.domCloneOuterHeight;
		}

		this.dom.clone.css( {
			top: top,
			left: left
		} );
	},


	/**
	 * Emit an event on the DataTable for listeners
	 *
	 * @param  {string} name Event name
	 * @param  {array} args Event arguments
	 * @private
	 */
	_emitEvent: function ( name, args )
	{
		this.s.dt.iterator( 'table', function ( ctx, i ) {
			$(ctx.nTable).triggerHandler( name+'.dt', args );
		} );
	},


	/**
	 * Get pageX/Y position from an event, regardless of if it is a mouse or
	 * touch event.
	 *
	 * @param  {object} e Event
	 * @param  {string} pos X or Y (must be a capital)
	 * @private
	 */
	_eventToPage: function ( e, pos )
	{
		if ( e.type.indexOf( 'touch' ) !== -1 ) {
			return e.originalEvent.touches[0][ 'page'+pos ];
		}

		return e[ 'page'+pos ];
	},


	/**
	 * Mouse down event handler. Read initial positions and add event handlers
	 * for the move.
	 *
	 * @param  {object} e      Mouse event
	 * @param  {jQuery} target TR element that is to be moved
	 * @private
	 */
	_mouseDown: function ( e, target )
	{
		var that = this;
		var dt = this.s.dt;
		var start = this.s.start;

		var offset = target.offset();
		start.top = this._eventToPage( e, 'Y' );
		start.left = this._eventToPage( e, 'X' );
		start.offsetTop = offset.top;
		start.offsetLeft = offset.left;
		start.nodes = $.unique( dt.rows( { page: 'current' } ).nodes().toArray() );

		this._cachePositions();
		this._clone( target );
		this._clonePosition( e );

		this.dom.target = target;
		target.addClass( 'dt-rowReorder-moving' );

		$( document )
			.on( 'mouseup.rowReorder touchend.rowReorder', function (e) {
				that._mouseUp(e);
			} )
			.on( 'mousemove.rowReorder touchmove.rowReorder', function (e) {
				that._mouseMove(e);
			} );

		// Check if window is x-scrolling - if not, disable it for the duration
		// of the drag
		if ( $(window).width() === $(document).width() ) {
			$(document.body).addClass( 'dt-rowReorder-noOverflow' );
		}

		// Cache scrolling information so mouse move doesn't need to read.
		// This assumes that the window and DT scroller will not change size
		// during an row drag, which I think is a fair assumption
		var scrollWrapper = this.dom.dtScroll;
		this.s.scroll = {
			windowHeight: $(window).height(),
			windowWidth:  $(window).width(),
			dtTop:        scrollWrapper.length ? scrollWrapper.offset().top : null,
			dtLeft:       scrollWrapper.length ? scrollWrapper.offset().left : null,
			dtHeight:     scrollWrapper.length ? scrollWrapper.outerHeight() : null,
			dtWidth:      scrollWrapper.length ? scrollWrapper.outerWidth() : null
		};
	},


	/**
	 * Mouse move event handler - move the cloned row and shuffle the table's
	 * rows if required.
	 *
	 * @param  {object} e Mouse event
	 * @private
	 */
	_mouseMove: function ( e )
	{
		this._clonePosition( e );

		// Transform the mouse position into a position in the table's body
		var bodyY = this._eventToPage( e, 'Y' ) - this.s.bodyTop;
		var middles = this.s.middles;
		var insertPoint = null;
		var dt = this.s.dt;
		var body = dt.table().body();

		// Determine where the row should be inserted based on the mouse
		// position
		for ( var i=0, ien=middles.length ; i<ien ; i++ ) {
			if ( bodyY < middles[i] ) {
				insertPoint = i;
				break;
			}
		}

		if ( insertPoint === null ) {
			insertPoint = middles.length;
		}

		// Perform the DOM shuffle if it has changed from last time
		if ( this.s.lastInsert === null || this.s.lastInsert !== insertPoint ) {
			if ( insertPoint === 0 ) {
				this.dom.target.prependTo( body );
			}
			else {
				var nodes = $.unique( dt.rows( { page: 'current' } ).nodes().toArray() );

				if ( insertPoint > this.s.lastInsert ) {
					this.dom.target.insertAfter( nodes[ insertPoint-1 ] );
				}
				else {
					this.dom.target.insertBefore( nodes[ insertPoint ] );
				}
			}

			this._cachePositions();

			this.s.lastInsert = insertPoint;
		}

		this._shiftScroll( e );
	},


	/**
	 * Mouse up event handler - release the event handlers and perform the
	 * table updates
	 *
	 * @param  {object} e Mouse event
	 * @private
	 */
	_mouseUp: function ( e )
	{
		var that = this;
		var dt = this.s.dt;
		var i, ien;
		var dataSrc = this.c.dataSrc;

		this.dom.clone.remove();
		this.dom.clone = null;

		this.dom.target.removeClass( 'dt-rowReorder-moving' );
		//this.dom.target = null;

		$(document).off( '.rowReorder' );
		$(document.body).removeClass( 'dt-rowReorder-noOverflow' );

		clearInterval( this.s.scrollInterval );
		this.s.scrollInterval = null;

		// Calculate the difference
		var startNodes = this.s.start.nodes;
		var endNodes = $.unique( dt.rows( { page: 'current' } ).nodes().toArray() );
		var idDiff = {};
		var fullDiff = [];
		var diffNodes = [];
		var getDataFn = this.s.getDataFn;
		var setDataFn = this.s.setDataFn;

		for ( i=0, ien=startNodes.length ; i<ien ; i++ ) {
			if ( startNodes[i] !== endNodes[i] ) {
				var id = dt.row( endNodes[i] ).id();
				var endRowData = dt.row( endNodes[i] ).data();
				var startRowData = dt.row( startNodes[i] ).data();

				if ( id ) {
					idDiff[ id ] = getDataFn( startRowData );
				}

				fullDiff.push( {
					node: endNodes[i],
					oldData: getDataFn( endRowData ),
					newData: getDataFn( startRowData ),
					newPosition: i,
					oldPosition: $.inArray( endNodes[i], startNodes )
				} );

				diffNodes.push( endNodes[i] );
			}
		}
		
		// Create event args
		var eventArgs = [ fullDiff, {
			dataSrc:    dataSrc,
			nodes:      diffNodes,
			values:     idDiff,
			triggerRow: dt.row( this.dom.target )
		} ];
		
		// Emit event
		this._emitEvent( 'row-reorder', eventArgs );

		var update = function () {
			if ( that.c.update ) {
				for ( i=0, ien=fullDiff.length ; i<ien ; i++ ) {
					var row = dt.row( fullDiff[i].node );
					var rowData = row.data();

					setDataFn( rowData, fullDiff[i].newData );

					// Invalidate the cell that has the same data source as the dataSrc
					dt.columns().every( function () {
						if ( this.dataSrc() === dataSrc ) {
							dt.cell( fullDiff[i].node, this.index() ).invalidate( 'data' );
						}
					} );
				}

				// Trigger row reordered event
				that._emitEvent( 'row-reordered', eventArgs );

				dt.draw( false );
			}
		};

		// Editor interface
		if ( this.c.editor ) {
			// Disable user interaction while Editor is submitting
			this.c.enable = false;

			this.c.editor
				.edit(
					diffNodes,
					false,
					$.extend( {submit: 'changed'}, this.c.formOptions )
				)
				.multiSet( dataSrc, idDiff )
				.one( 'submitUnsuccessful.rowReorder', function () {
					dt.draw( false );
				} )
				.one( 'submitSuccess.rowReorder', function () {
					update();
				} )
				.one( 'submitComplete', function () {
					that.c.enable = true;
					that.c.editor.off( '.rowReorder' );
				} )
				.submit();
		}
		else {
			update();
		}
	},


	/**
	 * Move the window and DataTables scrolling during a drag to scroll new
	 * content into view.
	 *
	 * This matches the `_shiftScroll` method used in AutoFill, but only
	 * horizontal scrolling is considered here.
	 *
	 * @param  {object} e Mouse move event object
	 * @private
	 */
	_shiftScroll: function ( e )
	{
		var that = this;
		var dt = this.s.dt;
		var scroll = this.s.scroll;
		var runInterval = false;
		var scrollSpeed = 5;
		var buffer = 65;
		var
			windowY = e.pageY - document.body.scrollTop,
			windowVert,
			dtVert;

		// Window calculations - based on the mouse position in the window,
		// regardless of scrolling
		if ( windowY < buffer ) {
			windowVert = scrollSpeed * -1;
		}
		else if ( windowY > scroll.windowHeight - buffer ) {
			windowVert = scrollSpeed;
		}

		// DataTables scrolling calculations - based on the table's position in
		// the document and the mouse position on the page
		if ( scroll.dtTop !== null && e.pageY < scroll.dtTop + buffer ) {
			dtVert = scrollSpeed * -1;
		}
		else if ( scroll.dtTop !== null && e.pageY > scroll.dtTop + scroll.dtHeight - buffer ) {
			dtVert = scrollSpeed;
		}

		// This is where it gets interesting. We want to continue scrolling
		// without requiring a mouse move, so we need an interval to be
		// triggered. The interval should continue until it is no longer needed,
		// but it must also use the latest scroll commands (for example consider
		// that the mouse might move from scrolling up to scrolling left, all
		// with the same interval running. We use the `scroll` object to "pass"
		// this information to the interval. Can't use local variables as they
		// wouldn't be the ones that are used by an already existing interval!
		if ( windowVert || dtVert ) {
			scroll.windowVert = windowVert;
			scroll.dtVert = dtVert;
			runInterval = true;
		}
		else if ( this.s.scrollInterval ) {
			// Don't need to scroll - remove any existing timer
			clearInterval( this.s.scrollInterval );
			this.s.scrollInterval = null;
		}

		// If we need to run the interval to scroll and there is no existing
		// interval (if there is an existing one, it will continue to run)
		if ( ! this.s.scrollInterval && runInterval ) {
			this.s.scrollInterval = setInterval( function () {
				// Don't need to worry about setting scroll <0 or beyond the
				// scroll bound as the browser will just reject that.
				if ( scroll.windowVert ) {
					document.body.scrollTop += scroll.windowVert;
				}

				// DataTables scrolling
				if ( scroll.dtVert ) {
					var scroller = that.dom.dtScroll[0];

					if ( scroll.dtVert ) {
						scroller.scrollTop += scroll.dtVert;
					}
				}
			}, 20 );
		}
	}
} );



/**
 * RowReorder default settings for initialisation
 *
 * @namespace
 * @name RowReorder.defaults
 * @static
 */
RowReorder.defaults = {
	/**
	 * Data point in the host row's data source object for where to get and set
	 * the data to reorder. This will normally also be the sorting column.
	 *
	 * @type {Number}
	 */
	dataSrc: 0,

	/**
	 * Editor instance that will be used to perform the update
	 *
	 * @type {DataTable.Editor}
	 */
	editor: null,

	/**
	 * Enable / disable RowReorder's user interaction
	 * @type {Boolean}
	 */
	enable: true,

	/**
	 * Form options to pass to Editor when submitting a change in the row order.
	 * See the Editor `from-options` object for details of the options
	 * available.
	 * @type {Object}
	 */
	formOptions: {},

	/**
	 * Drag handle selector. This defines the element that when dragged will
	 * reorder a row.
	 *
	 * @type {String}
	 */
	selector: 'td:first-child',

	/**
	 * Optionally lock the dragged row's x-position. This can be `true` to
	 * fix the position match the host table's, `false` to allow free movement
	 * of the row, or a number to define an offset from the host table.
	 *
	 * @type {Boolean|number}
	 */
	snapX: false,

	/**
	 * Update the table's data on drop
	 *
	 * @type {Boolean}
	 */
	update: true
};


/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - work around for a bug in DT... Not documented
Api.register( 'rowReorder()', function () {
	return this;
} );

Api.register( 'rowReorder.enable()', function ( toggle ) {
	if ( toggle === undefined ) {
		toggle = true;
	}

	return this.iterator( 'table', function ( ctx ) {
		if ( ctx.rowreorder ) {
			ctx.rowreorder.c.enable = toggle;
		}
	} );
} );

Api.register( 'rowReorder.disable()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx.rowreorder ) {
			ctx.rowreorder.c.enable = false;
		}
	} );
} );


/**
 * Version information
 *
 * @name RowReorder.version
 * @static
 */
RowReorder.version = '1.2.3';


$.fn.dataTable.RowReorder = RowReorder;
$.fn.DataTable.RowReorder = RowReorder;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'init.dt.dtr', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.rowReorder;
	var defaults = DataTable.defaults.rowReorder;

	if ( init || defaults ) {
		var opts = $.extend( {}, init, defaults );

		if ( init !== false ) {
			new RowReorder( settings, opts  );
		}
	}
} );


return RowReorder;
}));


/*! Select for DataTables 1.2.5
 * 2015-2018 SpryMedia Ltd - datatables.net/license/mit
 */

/**
 * @summary     Select for DataTables
 * @description A collection of API methods, events and buttons for DataTables
 *   that provides selection options of the items in a DataTable
 * @version     1.2.5
 * @file        dataTables.select.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     datatables.net/forums
 * @copyright   Copyright 2015-2018 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net/extensions/select
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Version information for debugger
DataTable.select = {};

DataTable.select.version = '1.2.5';

DataTable.select.init = function ( dt ) {
	var ctx = dt.settings()[0];
	var init = ctx.oInit.select;
	var defaults = DataTable.defaults.select;
	var opts = init === undefined ?
		defaults :
		init;

	// Set defaults
	var items = 'row';
	var style = 'api';
	var blurable = false;
	var info = true;
	var selector = 'td, th';
	var className = 'selected';
	var setStyle = false;

	ctx._select = {};

	// Initialisation customisations
	if ( opts === true ) {
		style = 'os';
		setStyle = true;
	}
	else if ( typeof opts === 'string' ) {
		style = opts;
		setStyle = true;
	}
	else if ( $.isPlainObject( opts ) ) {
		if ( opts.blurable !== undefined ) {
			blurable = opts.blurable;
		}

		if ( opts.info !== undefined ) {
			info = opts.info;
		}

		if ( opts.items !== undefined ) {
			items = opts.items;
		}

		if ( opts.style !== undefined ) {
			style = opts.style;
			setStyle = true;
		}

		if ( opts.selector !== undefined ) {
			selector = opts.selector;
		}

		if ( opts.className !== undefined ) {
			className = opts.className;
		}
	}

	dt.select.selector( selector );
	dt.select.items( items );
	dt.select.style( style );
	dt.select.blurable( blurable );
	dt.select.info( info );
	ctx._select.className = className;


	// Sort table based on selected rows. Requires Select Datatables extension
	$.fn.dataTable.ext.order['select-checkbox'] = function ( settings, col ) {
		return this.api().column( col, {order: 'index'} ).nodes().map( function ( td ) {
			if ( settings._select.items === 'row' ) {
				return $( td ).parent().hasClass( settings._select.className );
			} else if ( settings._select.items === 'cell' ) {
				return $( td ).hasClass( settings._select.className );
			}
			return false;
		});
	};

	// If the init options haven't enabled select, but there is a selectable
	// class name, then enable
	if ( ! setStyle && $( dt.table().node() ).hasClass( 'selectable' ) ) {
		dt.select.style( 'os' );
	}
};

/*

Select is a collection of API methods, event handlers, event emitters and
buttons (for the `Buttons` extension) for DataTables. It provides the following
features, with an overview of how they are implemented:

## Selection of rows, columns and cells. Whether an item is selected or not is
   stored in:

* rows: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoData` object for each row
* columns: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoColumns` object for each column
* cells: a `_selected_cells` property which contains an array of boolean values
  of the `aoData` object for each row. The array is the same length as the
  columns array, with each element of it representing a cell.

This method of using boolean flags allows Select to operate when nodes have not
been created for rows / cells (DataTables' defer rendering feature).

## API methods

A range of API methods are available for triggering selection and de-selection
of rows. Methods are also available to configure the selection events that can
be triggered by an end user (such as which items are to be selected). To a large
extent, these of API methods *is* Select. It is basically a collection of helper
functions that can be used to select items in a DataTable.

Configuration of select is held in the object `_select` which is attached to the
DataTables settings object on initialisation. Select being available on a table
is not optional when Select is loaded, but its default is for selection only to
be available via the API - so the end user wouldn't be able to select rows
without additional configuration.

The `_select` object contains the following properties:

```
{
	items:string     - Can be `rows`, `columns` or `cells`. Defines what item 
	                   will be selected if the user is allowed to activate row
	                   selection using the mouse.
	style:string     - Can be `none`, `single`, `multi` or `os`. Defines the
	                   interaction style when selecting items
	blurable:boolean - If row selection can be cleared by clicking outside of
	                   the table
	info:boolean     - If the selection summary should be shown in the table
	                   information elements
}
```

In addition to the API methods, Select also extends the DataTables selector
options for rows, columns and cells adding a `selected` option to the selector
options object, allowing the developer to select only selected items or
unselected items.

## Mouse selection of items

Clicking on items can be used to select items. This is done by a simple event
handler that will select the items using the API methods.

 */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

/**
 * Add one or more cells to the selection when shift clicking in OS selection
 * style cell selection.
 *
 * Cell range is more complicated than row and column as we want to select
 * in the visible grid rather than by index in sequence. For example, if you
 * click first in cell 1-1 and then shift click in 2-2 - cells 1-2 and 2-1
 * should also be selected (and not 1-3, 1-4. etc)
 * 
 * @param  {DataTable.Api} dt   DataTable
 * @param  {object}        idx  Cell index to select to
 * @param  {object}        last Cell index to select from
 * @private
 */
function cellRange( dt, idx, last )
{
	var indexes;
	var columnIndexes;
	var rowIndexes;
	var selectColumns = function ( start, end ) {
		if ( start > end ) {
			var tmp = end;
			end = start;
			start = tmp;
		}
		
		var record = false;
		return dt.columns( ':visible' ).indexes().filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) { // not else if, as start might === end
				record = false;
				return true;
			}

			return record;
		} );
	};

	var selectRows = function ( start, end ) {
		var indexes = dt.rows( { search: 'applied' } ).indexes();

		// Which comes first - might need to swap
		if ( indexes.indexOf( start ) > indexes.indexOf( end ) ) {
			var tmp = end;
			end = start;
			start = tmp;
		}

		var record = false;
		return indexes.filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) {
				record = false;
				return true;
			}

			return record;
		} );
	};

	if ( ! dt.cells( { selected: true } ).any() && ! last ) {
		// select from the top left cell to this one
		columnIndexes = selectColumns( 0, idx.column );
		rowIndexes = selectRows( 0 , idx.row );
	}
	else {
		// Get column indexes between old and new
		columnIndexes = selectColumns( last.column, idx.column );
		rowIndexes = selectRows( last.row , idx.row );
	}

	indexes = dt.cells( rowIndexes, columnIndexes ).flatten();

	if ( ! dt.cells( idx, { selected: true } ).any() ) {
		// Select range
		dt.cells( indexes ).select();
	}
	else {
		// Deselect range
		dt.cells( indexes ).deselect();
	}
}

/**
 * Disable mouse selection by removing the selectors
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function disableMouseSelection( dt )
{
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	$( dt.table().container() )
		.off( 'mousedown.dtSelect', selector )
		.off( 'mouseup.dtSelect', selector )
		.off( 'click.dtSelect', selector );

	$('body').off( 'click.dtSelect' + dt.table().node().id );
}

/**
 * Attach mouse listeners to the table to allow mouse selection of items
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function enableMouseSelection ( dt )
{
	var container = $( dt.table().container() );
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	container
		.on( 'mousedown.dtSelect', selector, function(e) {
			// Disallow text selection for shift clicking on the table so multi
			// element selection doesn't look terrible!
			if ( e.shiftKey || e.metaKey || e.ctrlKey ) {
				container
					.css( '-moz-user-select', 'none' )
					.one('selectstart.dtSelect', selector, function () {
						return false;
					} );
			}
		} )
		.on( 'mouseup.dtSelect', selector, function() {
			// Allow text selection to occur again, Mozilla style (tested in FF
			// 35.0.1 - still required)
			container.css( '-moz-user-select', '' );
		} )
		.on( 'click.dtSelect', selector, function ( e ) {
			var items = dt.select.items();
			var idx;

			// If text was selected (click and drag), then we shouldn't change
			// the row's selected state
			if ( window.getSelection ) {
				var selection = window.getSelection();

				// If the element that contains the selection is not in the table, we can ignore it
				// This can happen if the developer selects text from the click event
				if ( ! selection.anchorNode || $(selection.anchorNode).closest('table')[0] === dt.table().node() ) {
					if ( $.trim(selection.toString()) !== '' ) {
						return;
					}
				}
			}

			var ctx = dt.settings()[0];

			// Ignore clicks inside a sub-table
			if ( $(e.target).closest('div.dataTables_wrapper')[0] != dt.table().container() ) {
				return;
			}

			var cell = dt.cell( $(e.target).closest('td, th') );

			// Check the cell actually belongs to the host DataTable (so child
			// rows, etc, are ignored)
			if ( ! cell.any() ) {
				return;
			}

			var event = $.Event('user-select.dt');
			eventTrigger( dt, event, [ items, cell, e ] );

			if ( event.isDefaultPrevented() ) {
				return;
			}

			var cellIndex = cell.index();
			if ( items === 'row' ) {
				idx = cellIndex.row;
				typeSelect( e, dt, ctx, 'row', idx );
			}
			else if ( items === 'column' ) {
				idx = cell.index().column;
				typeSelect( e, dt, ctx, 'column', idx );
			}
			else if ( items === 'cell' ) {
				idx = cell.index();
				typeSelect( e, dt, ctx, 'cell', idx );
			}

			ctx._select_lastCell = cellIndex;
		} );

	// Blurable
	$('body').on( 'click.dtSelect' + dt.table().node().id, function ( e ) {
		if ( ctx._select.blurable ) {
			// If the click was inside the DataTables container, don't blur
			if ( $(e.target).parents().filter( dt.table().container() ).length ) {
				return;
			}

			// Ignore elements which have been removed from the DOM (i.e. paging
			// buttons)
			if ( $(e.target).parents('html').length === 0 ) {
			 	return;
			}

			// Don't blur in Editor form
			if ( $(e.target).parents('div.DTE').length ) {
				return;
			}

			clear( ctx, true );
		}
	} );
}

/**
 * Trigger an event on a DataTable
 *
 * @param {DataTable.Api} api      DataTable to trigger events on
 * @param  {boolean}      selected true if selected, false if deselected
 * @param  {string}       type     Item type acting on
 * @param  {boolean}      any      Require that there are values before
 *     triggering
 * @private
 */
function eventTrigger ( api, type, args, any )
{
	if ( any && ! api.flatten().length ) {
		return;
	}

	if ( typeof type === 'string' ) {
		type = type +'.dt';
	}

	args.unshift( api );

	$(api.table().node()).trigger( type, args );
}

/**
 * Update the information element of the DataTable showing information about the
 * items selected. This is done by adding tags to the existing text
 * 
 * @param {DataTable.Api} api DataTable to update
 * @private
 */
function info ( api )
{
	var ctx = api.settings()[0];

	if ( ! ctx._select.info || ! ctx.aanFeatures.i ) {
		return;
	}

	if ( api.select.style() === 'api' ) {
		return;
	}

	var rows    = api.rows( { selected: true } ).flatten().length;
	var columns = api.columns( { selected: true } ).flatten().length;
	var cells   = api.cells( { selected: true } ).flatten().length;

	var add = function ( el, name, num ) {
		el.append( $('<span class="select-item"/>').append( api.i18n(
			'select.'+name+'s',
			{ _: '%d '+name+'s selected', 0: '', 1: '1 '+name+' selected' },
			num
		) ) );
	};

	// Internal knowledge of DataTables to loop over all information elements
	$.each( ctx.aanFeatures.i, function ( i, el ) {
		el = $(el);

		var output  = $('<span class="select-info"/>');
		add( output, 'row', rows );
		add( output, 'column', columns );
		add( output, 'cell', cells  );

		var exisiting = el.children('span.select-info');
		if ( exisiting.length ) {
			exisiting.remove();
		}

		if ( output.text() !== '' ) {
			el.append( output );
		}
	} );
}

/**
 * Initialisation of a new table. Attach event handlers and callbacks to allow
 * Select to operate correctly.
 *
 * This will occur _after_ the initial DataTables initialisation, although
 * before Ajax data is rendered, if there is ajax data
 *
 * @param  {DataTable.settings} ctx Settings object to operate on
 * @private
 */
function init ( ctx ) {
	var api = new DataTable.Api( ctx );

	// Row callback so that classes can be added to rows and cells if the item
	// was selected before the element was created. This will happen with the
	// `deferRender` option enabled.
	// 
	// This method of attaching to `aoRowCreatedCallback` is a hack until
	// DataTables has proper events for row manipulation If you are reviewing
	// this code to create your own plug-ins, please do not do this!
	ctx.aoRowCreatedCallback.push( {
		fn: function ( row, data, index ) {
			var i, ien;
			var d = ctx.aoData[ index ];

			// Row
			if ( d._select_selected ) {
				$( row ).addClass( ctx._select.className );
			}

			// Cells and columns - if separated out, we would need to do two
			// loops, so it makes sense to combine them into a single one
			for ( i=0, ien=ctx.aoColumns.length ; i<ien ; i++ ) {
				if ( ctx.aoColumns[i]._select_selected || (d._selected_cells && d._selected_cells[i]) ) {
					$(d.anCells[i]).addClass( ctx._select.className );
				}
			}
		},
		sName: 'select-deferRender'
	} );

	// On Ajax reload we want to reselect all rows which are currently selected,
	// if there is an rowId (i.e. a unique value to identify each row with)
	api.on( 'preXhr.dt.dtSelect', function () {
		// note that column selection doesn't need to be cached and then
		// reselected, as they are already selected
		var rows = api.rows( { selected: true } ).ids( true ).filter( function ( d ) {
			return d !== undefined;
		} );

		var cells = api.cells( { selected: true } ).eq(0).map( function ( cellIdx ) {
			var id = api.row( cellIdx.row ).id( true );
			return id ?
				{ row: id, column: cellIdx.column } :
				undefined;
		} ).filter( function ( d ) {
			return d !== undefined;
		} );

		// On the next draw, reselect the currently selected items
		api.one( 'draw.dt.dtSelect', function () {
			api.rows( rows ).select();

			// `cells` is not a cell index selector, so it needs a loop
			if ( cells.any() ) {
				cells.each( function ( id ) {
					api.cells( id.row, id.column ).select();
				} );
			}
		} );
	} );

	// Update the table information element with selected item summary
	api.on( 'draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt info.dt', function () {
		info( api );
	} );

	// Clean up and release
	api.on( 'destroy.dtSelect', function () {
		disableMouseSelection( api );
		api.off( '.dtSelect' );
	} );
}

/**
 * Add one or more items (rows or columns) to the selection when shift clicking
 * in OS selection style
 *
 * @param  {DataTable.Api} dt   DataTable
 * @param  {string}        type Row or column range selector
 * @param  {object}        idx  Item index to select to
 * @param  {object}        last Item index to select from
 * @private
 */
function rowColumnRange( dt, type, idx, last )
{
	// Add a range of rows from the last selected row to this one
	var indexes = dt[type+'s']( { search: 'applied' } ).indexes();
	var idx1 = $.inArray( last, indexes );
	var idx2 = $.inArray( idx, indexes );

	if ( ! dt[type+'s']( { selected: true } ).any() && idx1 === -1 ) {
		// select from top to here - slightly odd, but both Windows and Mac OS
		// do this
		indexes.splice( $.inArray( idx, indexes )+1, indexes.length );
	}
	else {
		// reverse so we can shift click 'up' as well as down
		if ( idx1 > idx2 ) {
			var tmp = idx2;
			idx2 = idx1;
			idx1 = tmp;
		}

		indexes.splice( idx2+1, indexes.length );
		indexes.splice( 0, idx1 );
	}

	if ( ! dt[type]( idx, { selected: true } ).any() ) {
		// Select range
		dt[type+'s']( indexes ).select();
	}
	else {
		// Deselect range - need to keep the clicked on row selected
		indexes.splice( $.inArray( idx, indexes ), 1 );
		dt[type+'s']( indexes ).deselect();
	}
}

/**
 * Clear all selected items
 *
 * @param  {DataTable.settings} ctx Settings object of the host DataTable
 * @param  {boolean} [force=false] Force the de-selection to happen, regardless
 *     of selection style
 * @private
 */
function clear( ctx, force )
{
	if ( force || ctx._select.style === 'single' ) {
		var api = new DataTable.Api( ctx );
		
		api.rows( { selected: true } ).deselect();
		api.columns( { selected: true } ).deselect();
		api.cells( { selected: true } ).deselect();
	}
}

/**
 * Select items based on the current configuration for style and items.
 *
 * @param  {object}             e    Mouse event object
 * @param  {DataTables.Api}     dt   DataTable
 * @param  {DataTable.settings} ctx  Settings object of the host DataTable
 * @param  {string}             type Items to select
 * @param  {int|object}         idx  Index of the item to select
 * @private
 */
function typeSelect ( e, dt, ctx, type, idx )
{
	var style = dt.select.style();
	var isSelected = dt[type]( idx, { selected: true } ).any();

	if ( style === 'os' ) {
		if ( e.ctrlKey || e.metaKey ) {
			// Add or remove from the selection
			dt[type]( idx ).select( ! isSelected );
		}
		else if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			// No cmd or shift click - deselect if selected, or select
			// this row only
			var selected = dt[type+'s']( { selected: true } );

			if ( isSelected && selected.flatten().length === 1 ) {
				dt[type]( idx ).deselect();
			}
			else {
				selected.deselect();
				dt[type]( idx ).select();
			}
		}
	} else if ( style == 'multi+shift' ) {
		if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			dt[ type ]( idx ).select( ! isSelected );
		}
	}
	else {
		dt[ type ]( idx ).select( ! isSelected );
	}
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables selectors
 */

// row and column are basically identical just assigned to different properties
// and checking a different array, so we can dynamically create the functions to
// reduce the code size
$.each( [
	{ type: 'row', prop: 'aoData' },
	{ type: 'column', prop: 'aoColumns' }
], function ( i, o ) {
	DataTable.ext.selector[ o.type ].push( function ( settings, opts, indexes ) {
		var selected = opts.selected;
		var data;
		var out = [];

		if ( selected !== true && selected !== false ) {
			return indexes;
		}

		for ( var i=0, ien=indexes.length ; i<ien ; i++ ) {
			data = settings[ o.prop ][ indexes[i] ];

			if ( (selected === true && data._select_selected === true) ||
			     (selected === false && ! data._select_selected )
			) {
				out.push( indexes[i] );
			}
		}

		return out;
	} );
} );

DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var selected = opts.selected;
	var rowData;
	var out = [];

	if ( selected === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		rowData = settings.aoData[ cells[i].row ];

		if ( (selected === true && rowData._selected_cells && rowData._selected_cells[ cells[i].column ] === true) ||
		     (selected === false && ( ! rowData._selected_cells || ! rowData._selected_cells[ cells[i].column ] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;
var apiRegisterPlural = DataTable.Api.registerPlural;

apiRegister( 'select()', function () {
	return this.iterator( 'table', function ( ctx ) {
		DataTable.select.init( new DataTable.Api( ctx ) );
	} );
} );

apiRegister( 'select.blurable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.blurable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.blurable = flag;
	} );
} );

apiRegister( 'select.info()', function ( flag ) {
	if ( info === undefined ) {
		return this.context[0]._select.info;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.info = flag;
	} );
} );

apiRegister( 'select.items()', function ( items ) {
	if ( items === undefined ) {
		return this.context[0]._select.items;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.items = items;

		eventTrigger( new DataTable.Api( ctx ), 'selectItems', [ items ] );
	} );
} );

// Takes effect from the _next_ selection. None disables future selection, but
// does not clear the current selection. Use the `deselect` methods for that
apiRegister( 'select.style()', function ( style ) {
	if ( style === undefined ) {
		return this.context[0]._select.style;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.style = style;

		if ( ! ctx._select_init ) {
			init( ctx );
		}

		// Add / remove mouse event handlers. They aren't required when only
		// API selection is available
		var dt = new DataTable.Api( ctx );
		disableMouseSelection( dt );
		
		if ( style !== 'api' ) {
			enableMouseSelection( dt );
		}

		eventTrigger( new DataTable.Api( ctx ), 'selectStyle', [ style ] );
	} );
} );

apiRegister( 'select.selector()', function ( selector ) {
	if ( selector === undefined ) {
		return this.context[0]._select.selector;
	}

	return this.iterator( 'table', function ( ctx ) {
		disableMouseSelection( new DataTable.Api( ctx ) );

		ctx._select.selector = selector;

		if ( ctx._select.style !== 'api' ) {
			enableMouseSelection( new DataTable.Api( ctx ) );
		}
	} );
} );



apiRegisterPlural( 'rows().select()', 'row().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'row', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoData[ idx ]._select_selected = true;
		$( ctx.aoData[ idx ].nTr ).addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().select()', 'column().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'column', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoColumns[ idx ]._select_selected = true;

		var column = new DataTable.Api( ctx ).column( idx );

		$( column.header() ).addClass( ctx._select.className );
		$( column.footer() ).addClass( ctx._select.className );

		column.nodes().to$().addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().select()', 'cell().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		clear( ctx );

		var data = ctx.aoData[ rowIdx ];

		if ( data._selected_cells === undefined ) {
			data._selected_cells = [];
		}

		data._selected_cells[ colIdx ] = true;

		if ( data.anCells ) {
			$( data.anCells[ colIdx ] ).addClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'cell', api[i] ], true );
	} );

	return this;
} );


apiRegisterPlural( 'rows().deselect()', 'row().deselect()', function () {
	var api = this;

	this.iterator( 'row', function ( ctx, idx ) {
		ctx.aoData[ idx ]._select_selected = false;
		$( ctx.aoData[ idx ].nTr ).removeClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().deselect()', 'column().deselect()', function () {
	var api = this;

	this.iterator( 'column', function ( ctx, idx ) {
		ctx.aoColumns[ idx ]._select_selected = false;

		var api = new DataTable.Api( ctx );
		var column = api.column( idx );

		$( column.header() ).removeClass( ctx._select.className );
		$( column.footer() ).removeClass( ctx._select.className );

		// Need to loop over each cell, rather than just using
		// `column().nodes()` as cells which are individually selected should
		// not have the `selected` class removed from them
		api.cells( null, idx ).indexes().each( function (cellIdx) {
			var data = ctx.aoData[ cellIdx.row ];
			var cellSelected = data._selected_cells;

			if ( data.anCells && (! cellSelected || ! cellSelected[ cellIdx.column ]) ) {
				$( data.anCells[ cellIdx.column  ] ).removeClass( ctx._select.className );
			}
		} );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().deselect()', 'cell().deselect()', function () {
	var api = this;

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		var data = ctx.aoData[ rowIdx ];

		data._selected_cells[ colIdx ] = false;

		// Remove class only if the cells exist, and the cell is not column
		// selected, in which case the class should remain (since it is selected
		// in the column)
		if ( data.anCells && ! ctx.aoColumns[ colIdx ]._select_selected ) {
			$( data.anCells[ colIdx ] ).removeClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'cell', api[i] ], true );
	} );

	return this;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */
function i18n( label, def ) {
	return function (dt) {
		return dt.i18n( 'buttons.'+label, def );
	};
}

// Common events with suitable namespaces
function namespacedEvents ( config ) {
	var unique = config._eventNamespace;

	return 'draw.dt.DT'+unique+' select.dt.DT'+unique+' deselect.dt.DT'+unique;
}

function enabled ( dt, config ) {
	if ( $.inArray( 'rows', config.limitTo ) !== -1 && dt.rows( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'columns', config.limitTo ) !== -1 && dt.columns( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'cells', config.limitTo ) !== -1 && dt.cells( { selected: true } ).any() ) {
		return true;
	}

	return false;
}

var _buttonNamespace = 0;

$.extend( DataTable.ext.buttons, {
	selected: {
		text: i18n( 'selected', 'Selected' ),
		className: 'buttons-selected',
		limitTo: [ 'rows', 'columns', 'cells' ],
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			// .DT namespace listeners are removed by DataTables automatically
			// on table destroy
			dt.on( namespacedEvents(config), function () {
				that.enable( enabled(dt, config) );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectedSingle: {
		text: i18n( 'selectedSingle', 'Selected single' ),
		className: 'buttons-selected-single',
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count === 1 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectAll: {
		text: i18n( 'selectAll', 'Select all' ),
		className: 'buttons-select-all',
		action: function () {
			var items = this.select.items();
			this[ items+'s' ]().select();
		}
	},
	selectNone: {
		text: i18n( 'selectNone', 'Deselect all' ),
		className: 'buttons-select-none',
		action: function () {
			clear( this.settings()[0], true );
		},
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count > 0 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	}
} );

$.each( [ 'Row', 'Column', 'Cell' ], function ( i, item ) {
	var lc = item.toLowerCase();

	DataTable.ext.buttons[ 'select'+item+'s' ] = {
		text: i18n( 'select'+item+'s', 'Select '+lc+'s' ),
		className: 'buttons-select-'+lc+'s',
		action: function () {
			this.select.items( lc );
		},
		init: function ( dt ) {
			var that = this;

			dt.on( 'selectItems.dt.DT', function ( e, ctx, items ) {
				that.active( items === lc );
			} );
		}
	};
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if select has been defined in the options. Note
// this required that the table be in the document! If it isn't then something
// needs to trigger this method unfortunately. The next major release of
// DataTables will rework the events and address this.
$(document).on( 'preInit.dt.dtSelect', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	DataTable.select.init( new DataTable.Api( ctx ) );
} );


return DataTable.select;
}));



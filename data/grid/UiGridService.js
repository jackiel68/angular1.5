angular.module('dqApp.data')
    .service('UiGridService', function($modal, uiGridConstants) {

        var service = {};

        service.getDefaultOptions = function(onRegisterApiCallback) {
            return {
                enableGridMenu: false,
                enableSorting: false,
                enableHorizontalScrollbar: true,
                enableCellEditOnFocus: true,
                // Pagination
                paginationPageSizes: [10, 25, 100],
                paginationPageSize: 100,
                useExternalPagination: true,
                // PDF export
                exporterPdfDefaultStyle: {fontSize: 9},
                exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
                exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true},
                exporterPdfHeader: {text: "Imported Data", style: 'headerStyle'},
                exporterPdfFooter: function(currentPage, pageCount) {
                    return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
                },
                exporterPdfCustomFormatter: function(docDefinition) {
                    docDefinition.styles.headerStyle = {fontSize: 22, bold: true, alignment: 'center'};
                    docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
                    return docDefinition;
                },
                exporterPdfOrientation: 'landscape',
                exporterPdfPageSize: 'A4',
                exporterPdfMaxGridWidth: 630,
                // CSV Export
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                // onRegisterApi
                onRegisterApi: function(api) {
                    onRegisterApiCallback(api);
                }
            }
        };

        service.changeOptionsInModal= function(grid) {
            var modalInstance = $modal.open({
                templateUrl: 'data/grid/uigrid-options-modal.html',
                controller: 'UiGridOptionsCtrl as modal',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    columns: function () {
                        return grid.options.columnDefs;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                grid.options.columnDefs = result.columns;
                grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            }, function() {
            });
        };

        return service;
    });

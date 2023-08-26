import logo from './logo.svg';
import './App.css';

import React, { useRef, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { MultiSelect } from 'primereact/multiselect';
import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import { SplitButton } from 'primereact/splitbutton';
import { InputText } from "primereact/inputtext";
import { ProductService } from './service/ProductService';
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { NodeService } from './service/NodeService';
import { Toast } from 'primereact/toast';


function App() {

  const [products, setProducts] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState({ '0': true, '0-0': true });
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    price: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    description: { value: null, matchMode: FilterMatchMode.IN },
    category: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  const expandAll = () => {
    let _expandedKeys = {};

    for (let node of nodes) {
      expandNode(node, _expandedKeys);
    }

    setExpandedKeys(_expandedKeys);
  };

  const collapseAll = () => {
    setExpandedKeys({});
  };

  const expandNode = (node, _expandedKeys) => {
    if (node.children && node.children.length) {
      _expandedKeys[node.key] = true;

      for (let child of node.children) {
        expandNode(child, _expandedKeys);
      }
    }
  };

  const [selectedCities, setSelectedCities] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

  useEffect(() => {
    ProductService.getProductsWithOrdersSmall().then(data => setProducts(data));
    NodeService.getTreeNodes().then((data) => setNodes(data));
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
          <Toast ref={toast}></Toast>
          <SplitButton label="Actions" className="actionbtn" icon="pi pi-plus" onClick={save} model={items} severity="info" />
        </span>
      </div>
    );
  };

  const toast = useRef(null);
  const items = [
    {
      label: 'Update',
      icon: 'pi pi-refresh',
      command: () => {
        toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
      }
    },
    {
      label: 'Delete',
      icon: 'pi pi-times',
      command: () => {
        toast.current.show({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
      }
    },
    {
      label: 'React Website',
      icon: 'pi pi-external-link',
      command: () => {
        window.location.href = 'https://reactjs.org/';
      }
    },
    {
      label: 'Upload',
      icon: 'pi pi-upload',
      command: () => {
        //router.push('/fileupload');
      }
    }
  ];

  const save = () => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data Saved' });
  };

  function applyFilters(evt){
    console.log('applyFilters ', evt)
  }

  const header = renderHeader();

  return (
    <div>
      <div className='home_header'>
        <div className="app_name">Inventory Management</div>
        <div className="user_name">John Doe</div>
      </div>
      <div className="card">
        <div className="rows">

          <div className="row1">
            <div className="flex flex-wrap gap-2 mb-4">
              <Panel header="Navigation">
                <div className="card flex;align-items: center; ">
                  <div className='main_label'>Vassel : </div>
                  <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                    placeholder="Select Vassels" maxSelectedLabels={3} className="md:w-14rem " />
                </div>

                <div className="card flex; align-items: center;">

                  <div className='main_label'>Nav. Type : </div>
                  <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                    placeholder="Select Equipemnt" className="md:w-14rem ;align-items: center;" />
                </div>

                <div className="card flex;align-items: center;">

                  <div className='main_label'>Hierarchy : </div>
                  <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                    placeholder="System / Description" className="md:w-16rem;align-items: center;" />
                </div>

                <div className="card flex;align-items: center;">

                  <div className='main_label'> </div>
                  <Button label="Apply" raised severity="info" onClick={applyFilters} className="applybtn" />
                </div>

              </Panel>

            </div>

            <Tree value={nodes} filter expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} className="w-full md:w-25rem" />
          </div>
          <div className="row2">
            <DataTable value={products} stripedRows
              paginator rows={10}
              dataKey="id"
              selectionMode="single"
              tableStyle={{ minWidth: '50rem' }}
              filters={filters}
              globalFilterFields={[
                "code",
                "pricee",
                "description",
                "category"
              ]}
              header={header}
            >
              <Column field="code" header="Code"></Column>
              <Column field="price" header="Price"></Column>
              <Column field="name" header="Name"></Column>
              <Column field="description" header="Description"></Column>
              <Column field="category" header="Category"></Column>
              <Column field="quantity" header="Quantity"></Column>
              <Column field="rating" header="Rating"></Column>
              <Column field="inventoryStatus" header="InventoryStatus"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

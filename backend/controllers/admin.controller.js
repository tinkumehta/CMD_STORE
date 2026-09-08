import multer from 'multer';
import XLSX from 'xlsx';
import PurchaseOrder from '../models/PurchaseOrder.model.js';

const upload = multer({ dest: 'uploads/' });

// Upload Excel file
export const uploadExcel = [
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const mapped = rows.map(row => ({
      creator_name: row['Creator Name'],
      date: row['Date'] ? new Date(row['Date']) : null,
      po_no: row['PO NO'],
      creator_employee_no: row['Creator Employee No'],
      name_of_work: row['NAME OF THE WORK'],
      agency: row['AGENCY'],
      value_inr: parseFloat(row['Value (INR)']) || 0,
      enq_type: row['Enq Type'],
      ord_plant: row['Ord. Plant'],
      rfx_type: row['RFQ Type'],
      delivery_date: row['Delivery Date'] ? new Date(row['Delivery Date']) : null,
      doc_type: row['Doc. Type'],
      vendor_code: row['Vendor Code'],
      city: row['City'],
      region: row['Region'],
      amount_rs_l: parseFloat(row['Amount(Rs - L)']) || 0,
      currency: row['Currency'],
      delv_amount_rs_l: parseFloat(row['Delv. Amount(Rs. L)']) || 0,
      invoiced_amt_rs_l: parseFloat(row['Invoiced Amt.(Rs. L)']) || 0,
      treds_partner: row['TREDS Partner'],
      ssc_ind: row['SSC Ind.'],
      ssc_name: row['SSC Name'],
      capex_opex: row['Capex/Opex'],
      freight_clause: row['Freight Clause'],
      meg_ceg_indicator: row['MEG/CEG Indicator'],
      meg_ceg_enlistment_grp: row['MEG/CEG Enlistment Grp'],
      risk_cost_indicator: row['Risk & Cost Indicator'],
      risk_cost_po: row['Risk & Cost PO'],
      bidder_class: row['Bidder Class'],
      bid_opening_dt: row['Bid Opening Dt.'] ? new Date(row['Bid Opening Dt.']) : null,
      bg_applicability: row['BG Applicability'],
      invoicing_party: row['Invoicing Party'],
      ecm_approval_no: row['ECM Approval No.'],
      email: row['Email'],
      dist_code: row['Dist. Code'],
      mobile_no: row['Mobile No.'],
      department_code: row['Department Code'],
      dept_desc: row['Dept Desc.'],
      purchasing_group: row['Purchasing Group'],
      eproc_tag: row['eProc Tag'],
      indent_type: row['Indent Type'],
      reason_text: row['Reason Text'],
      vendor_type: row['Vendor Type'],
      pr_po_days: parseInt(row['PR-PO days'], 10) || 0,
      sme_amt_inr: parseFloat(row['SME Amt(INR)']) || 0,
      addlenqinf: row['AddlEnqInf'],
      released_by: row['Released By'],
    }));

    await PurchaseOrder.truncateAndInsert(mapped);
    res.status(201).json({ message: `Uploaded ${mapped.length} rows successfully` });
  },
];

// Update a purchase order
export const updatePO = async (req, res) => {
  const { id } = req.params;
  const updated = await PurchaseOrder.update(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Record not found' });
  }
  res.json(updated);
};

// Delete a purchase order
export const deletePO = async (req, res) => {
  const { id } = req.params;
  const deleted = await PurchaseOrder.delete(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Record not found' });
  }
  res.json({ message: 'Deleted successfully' });
};
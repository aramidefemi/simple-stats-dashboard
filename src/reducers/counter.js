import axios from 'axios';
async function getStats(url) {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api${url}`);

    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
}
const reducer = async (
  state = { 
  },
  action
) => {
  let partition = state;
  switch (action.type) {
    case 'GetUsersCount':
     const userCount = await getStats(
        `/kpi/users/${action.payload.start}/${action.payload.end}`
      );
      console.log('partition', userCount.users) 
     
      return { ...state, ...userCount };
    case 'GetTransactions':
      partition = await getStats(
        `/kpi/transactions/${action.payload.start}/${action.payload.end}`
      );
      return { ...state, ...partition };
    case 'GetProductsCountByInterval':
      partition['products'] = await getStats(
        `/kpi/products/${action.payload.start}/${action.payload.end}`
      );
      return { ...state, ...partition };;
    case 'GetMerchants':
      partition['merchants'] = await getStats(
        `/kpi/merchants/${action.payload.start}/${action.payload.end}`
      );
      return { ...state, ...partition };;
    case 'GetNewSellers':
      partition['newsellers'] = await getStats(
        `/kpi/sellers/first-time/${action.payload.start}/${action.payload.end}`
      );
      return { ...state, ...partition };;
    case 'GetUniqueSellers':
      partition['transactions'] = await getStats(
        `/kpi/sellers/${action.payload.start}/${action.payload.end}`
      );
      return { ...state, ...partition };;
    case 'GetMerchantsMedian':
      partition['transactions'] = await getStats(
        `/kpi/merchants/median/${action.payload.start}/${action.payload.end}`
      );
      return { ...state, ...partition };;
    default:
      return state;
  }
};

export default reducer;

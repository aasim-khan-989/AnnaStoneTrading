
const STORAGE_KEY =
  "anna_stone_estimates";

const ESTIMATE_KEY =
  "anna_stone_estimate_number";

export const loadEstimates = () => {

  const data =
    localStorage.getItem(
      STORAGE_KEY
    );

  return data
    ? JSON.parse(data)
    : [];
};

export const saveEstimates = (
  estimates
) => {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(estimates)
  );
};

export const getNextEstimateNumber =
  () => {

    const current =
      parseInt(
        localStorage.getItem(
          ESTIMATE_KEY
        )
      ) || 100;

    localStorage.setItem(
      ESTIMATE_KEY,
      current + 1
    );

    return current;
};
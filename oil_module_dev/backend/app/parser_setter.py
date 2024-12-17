import pandas as pd
import time, os, sys

# start = time.time()



def adjust_production(data_df:pd.DataFrame, coeff_df:pd.DataFrame, well_for_changes, date_str, production_limit):
  
    # Фильтруем данные по выбранным скважинам
    data_df_wells = data_df[data_df['Unnamed: 0'].isin(well_for_changes)]
    coeff_df_wells = coeff_df[coeff_df['Unnamed: 0'].isin(well_for_changes)]
  
    if data_df[date_str].sum() < production_limit:
        # Находим на сколько можем увеличить добычу
        adjusted_df = pd.DataFrame(data_df_wells[date_str].div(coeff_df_wells[date_str]).subtract(data_df_wells[date_str]).loc[coeff_df_wells[date_str] < 1])
        difference = production_limit - data_df.sum()[date_str]
        
        # sort by max(ascending = False) or min(ascending = True)
        for i, j in zip(adjusted_df.sort_values(date_str, ascending=False)[date_str], adjusted_df.sort_values(date_str, ascending=False).index):
            
            if i >= difference:
                coeff_df.loc[j, date_str] = (difference+data_df.loc[j, date_str])/(i+data_df.loc[j, date_str])
                data_df.loc[j, date_str] += difference    
               
                return data_df, coeff_df
            else:
                data_df.loc[j, date_str] += i
                coeff_df.loc[j, date_str] = 1
               
                difference -= i
            

    if data_df[date_str].sum() > production_limit:
        
        # Находим на сколько можем уменьшить добычу
        adjusted_df = pd.DataFrame(data_df_wells)
        
        difference = data_df.sum()[date_str] - production_limit
        
        # sort by max(ascending = False) or min(ascending = True)
        for i, j in zip(adjusted_df.sort_values(date_str, ascending=False)[date_str], adjusted_df.sort_values(date_str, ascending=False).index):
            
            if i >= difference:
                if coeff_df.loc[j, date_str] > 1:
                    coeff_df.loc[j, date_str] = 1      
                coeff_df.loc[j, date_str] = (data_df.loc[j, date_str] - difference)/(data_df.loc[j, date_str]/(coeff_df.loc[j, date_str]))

                data_df.loc[j, date_str] -= difference
                return data_df, coeff_df
            else:
                data_df.loc[j, date_str] -= i
                coeff_df.loc[j, date_str] = 0
                difference -= i
             
    return data_df, coeff_df


def array_adjust(data_df:pd.DataFrame, coeff_df:pd.DataFrame, well_for_changes, dates_str, production_limits):
    for date, limit in zip(dates_str, production_limits):
        
        try:
            data_df[date]
            adjusted_production = adjust_production(data_df, coeff_df, well_for_changes, date, limit)

            data_df[date] = adjusted_production[0][date]
            coeff_df[date] = adjusted_production[1][date]
        except:
            continue
    return data_df, coeff_df


    
def makeDataFrame(file, sheet):
    data_xls = pd.read_excel(file, sheet, index_col=None)
    data_xls.to_csv('formater_file.csv', encoding='utf-8', index=False)

    df = pd.read_csv('formater_file.csv', engine="python")
    os.remove('formater_file.csv')
    return df

def dataframe_to_xlsx(ready_df):
    writer = pd.ExcelWriter('./app/output.xlsx', engine='xlsxwriter')

    ready_df[0].to_excel(writer, index=None, sheet_name="Данные по добыче")
    ready_df[1].to_excel(writer, index=None, sheet_name="Коэффициенты по эксплуатации")
    writer._save()
   


# Задаем параметры
# well_for_changes = ['Well_2', 'Well_4', 'Well_6', 'Well_7', 'Well_11']
# dates_str = ["2025-01-01 00:00:00", "2025-02-01 00:00:00", "2025-03-01 00:00:00", "2025-06-01 00:00:00", "2025-10-01 00:00:00"]
# production_limits = [1000, 1200, 2000, 4000, 1000]

def adjust(well_for_changes, dates_str, production_limits):
    # Загрузка данных
    data_df = makeDataFrame('./app/input.xlsx', 'Данные по добыче')  # Датасет с добычей
    coeff_df = makeDataFrame('./app/input.xlsx', 'Коэффициенты эксплуатации')  # Датасет с коэффициентами

    ready_df = array_adjust(data_df, coeff_df, well_for_changes, dates_str, production_limits)

    dataframe_to_xlsx(ready_df)

# adjust(well_for_changes, dates_str, production_limits)

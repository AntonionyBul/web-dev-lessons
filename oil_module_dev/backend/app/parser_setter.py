import pandas as pd
from datetime import datetime as dt
from csv import DictReader
import numpy as np

def csv_from_excel(file, sheet):
    data_xls = pd.read_excel(file, sheet, index_col=None)
    data_xls.to_csv('csvfile.csv', encoding='utf-8', index=False)


def makeDataFrame(file, sheet):
    csv_from_excel(file, sheet)
    return pd.read_csv(
    'csvfile.csv',
    engine="python",
    )


def adjust_production(data_df:pd.DataFrame, coeff_df:pd.DataFrame, well_for_changes, date_str, production_limit):
 
    # Фильтруем данные по выбранным скважинам
    data_df_wells = data_df[data_df['Unnamed: 0'].isin(well_for_changes)]
    coeff_df_wells = coeff_df[coeff_df['Unnamed: 0'].isin(well_for_changes)]
       
    # Фильтруем по временным рамкам
    data_df = pd.DataFrame(data_df, columns=['Unnamed: 0', date_str])
    coeff_df = pd.DataFrame(coeff_df, columns=['Unnamed: 0', date_str])
    coeff_df_wells = pd.DataFrame(coeff_df_wells, columns=['Unnamed: 0', date_str])
    data_df_wells = pd.DataFrame(data_df_wells, columns=['Unnamed: 0', date_str])

    # print(data_df)
    # print(data_df_wells)
    # print(coeff_df_wells)
  
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
            


    # if data_df[date_str].sum() > production_limit:
        
    #     # Находим на сколько можем уменьшить добычу
    #     adjusted_df = pd.DataFrame(data_df_wells.loc[coeff_df_wells[date_str] < 1])
        
    #     difference = production_limit
        
    #     # sort by max(ascending = False) or min(ascending = True)
    #     for i, j in zip(adjusted_df.sort_values(date_str, ascending=False)[date_str], adjusted_df.sort_values(date_str, ascending=False).index):
    #         # print(i, j)
            
    #         if i >= difference:
    #             data_df.loc[j, date_str] += difference
    #             print(data_df.sum())
    #             return data_df
    #         else:
    #             data_df.loc[j, date_str] -= i
    #             coeff_df.loc[j, date_str] = 0

    #             difference -= i
                           
    # print(data_df.sum())

    return data_df, coeff_df


# Пример использования
# Загрузка данных

data_df = makeDataFrame('test.xlsx', 'Данные по добыче')  # Датасет с добычей
coeff_df = makeDataFrame('test.xlsx', 'Коэффициенты эксплуатации')  # Датасет с коэффициентами

# Задаем параметры
well_for_changes = ['Well_2', 'Well_4', 'Well_6', 'Well_7', 'Well_11']
date_str = "2025-10-01 00:00:00"
production_limit = 3200

# Выполняем подгонку увеличения
# adjusted_production = adjust_production(data_df, coeff_df, well_for_changes, date_str, production_limit)
# Выводим результат
# print(adjusted_production)

production_limit = 1000
# Выполняем подгонку уменьшения
adjusted_production = adjust_production(data_df, coeff_df, well_for_changes, date_str, production_limit)
# Выводим результат
print(adjusted_production)
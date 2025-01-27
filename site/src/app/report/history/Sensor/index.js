import React,{useState,useEffect} from 'react';
import {API_SERVER} from '@/constant/apis'
import style from './style.less';
import cls from 'classnames'
import { fix } from '@/util/fn'


const Sensor = ({data,inline}) => {

  return (
    <div className='g-table'>

      <div className="m-wrap">
        {/* <section className="tab1">
          <div className="m-tl">{data?.tab1.title}</div>
          <div className="m-data">
            {data?.tab1.data.map((k,j)=>
              <div className="m-item" key={j}>
                <label>{k.k}</label>
                <span data-unit={data?.tab1.unit[j]}>{fix(k.v,1)}</span>
              </div>
            )}
          </div>
        </section> */}

        <section className="tab2">
          <div className="m-tab2-wrap">
            <div className="m-tl">
              {data?.tab2?.title?.map((o,i)=>
                <div className="m-items" key={i}>
                  <span>{o.k}</span>
                  {o.v && <div className="m-item">
                    {o.v.map((k,j)=> <span key={j}>{k}</span>)}
                  </div>}
                </div>
              )}
            </div>

            {data?.tab2?.data?.map((o,i)=>
            <div className="m-data" key={i}>
              {o.map((k,j)=>
                <div className="m-item" key={j} data-unit={data?.tab2?.unit[j]}>{fix(k,1)}</div>
              )}
            </div>)}
          </div>
        </section>

      </div>
    </div>
  )

}



export default Sensor
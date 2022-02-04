import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Player } from '../player';
import { Stats } from '../stats';
import { PlayerService } from '../player.service';
import { ActivatedRoute } from '@angular/router';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { CalculatedStats } from '../calculatedStats';
import { ChartConfiguration, ChartType, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import * as ChartAnnotation from  'chartjs-plugin-annotation';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css']
})

export class PlayerStatsComponent implements OnInit {

  addToTable(tableBody: any, stat: String, tag: String): void {  
        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = '0';
  
        const td = document.createElement('td');
        td.style.borderWidth = '0';
        const text = document.createTextNode(stat + " " + tag);
  
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
  } 

  getOrCreateTooltip = (chart: { canvas: { parentNode: { querySelector: (arg0: string) => any; appendChild: (arg0: any) => void; }; }; }) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');
    
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
      tooltipEl.style.borderRadius = '3px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';
      
      const table = document.createElement('table');
      table.style.margin = '0px';
      
      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
  
    return tooltipEl;
  };
  
  externalTooltipHandler = (context: { chart: any; tooltip: any; }) => {
    // Tooltip Element
    const {chart, tooltip} = context;
    const tooltipEl = this.getOrCreateTooltip(chart);
  
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
  
    // Set Text
    if (tooltip.body) {
      var game = this.calculatedStats[tooltip.dataPoints[0].dataIndex];
      const titleLines = tooltip.title || [];
      var bodyLines = tooltip.body.map((b: { lines: any; }) => b.lines);

      const tableHead = document.createElement('thead');
      titleLines.forEach((title: string) => {
        const tr = document.createElement('tr');
        tr.style.borderWidth = '0';
  
        const th = document.createElement('th');
        th.style.borderWidth = '0';
        const text = document.createTextNode(title);

        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });
  
      const tableBody = document.createElement('tbody');
      this.addToTable(tableBody, game.avg, " AVG");
      this.addToTable(tableBody, game.ops, " OPS");
      const today = document.createElement('tr');
        today.style.backgroundColor = 'inherit';
        today.style.fontWeight = 'bolder';
        today.style.borderWidth = '0';
  
        const td = document.createElement('td');
        td.style.borderWidth = '0';
        const text = document.createTextNode("Today's Game:");
  
        td.appendChild(text);
        today.appendChild(td);
        tableBody.appendChild(today);
      this.addToTable(tableBody, game.H + "-" + game.AB, "");
      if(game.K > 0)
        this.addToTable(tableBody, game.K.toString(), "K");
      if(game.BB > 0)
        this.addToTable(tableBody, game.BB.toString(), "BB");
      if(game.HR > 0)
        this.addToTable(tableBody, game.HR.toString(), "HR");
      if(game.RBI > 0)
        this.addToTable(tableBody, game.RBI.toString(), "RBI");
      const tableRoot = tooltipEl.querySelector('table');
  
      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
  
      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }
  
    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
  
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = tooltip.caretX + 'px';
    tooltipEl.style.top = tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  };
  playerLoaded= false;
  playerStat: Stats[] = [];
  calculatedStats: CalculatedStats[] = [];
  avg: number[] = [];
  ops : number[] = [];
  games: string[] = [];
  playerName = "";
  playerId = "";
  team = "";
  teamImg = "";
  width = window.innerWidth * .7;
  height = window.innerHeight * .5;
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: this.avg,
        label: 'Batting Average',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: this.ops,
        label: 'OPS',
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        fill: 'origin',
      },
    ],
    labels: this.games
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
      'y-axis-0':
        {
          position: 'left',
          grid: {
            color: 'rgba(255, 0, 0, 0.3)'
          }
        }
    },

    plugins: {
      legend: { display: true },
      annotation: {
        annotations: [
          {
            type: 'line',
            scaleID: 'x',
            value: 'March',
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              position: 'center',
              enabled: true,
              color: 'orange',
              content: 'LineAnno',
              font: {
                weight: 'bold'
              }
            }
          },
        ],
      },
      tooltip: {
        enabled: false,
        mode: 'index',
        external: this.externalTooltipHandler
    }
    }
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private static generateNumber(i: number): number {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  // events
  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    //console.log(event, active);
  }

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService) { }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.getStats(routeParams['id']);
    });
  }

  getStats(id: number): void {
    console.log("PlayerID: " + id);
    this.playerService.getPlayerStats(id)
    .subscribe(stats => {this.playerStat = stats,
      this.playerName = this.playerStat[0].fullName,
      this.games.length = 0;
      this.avg.length = 0;
      this.ops.length = 0;
      this.calculateStats(),
      this.team = this.playerStat[0].team;
      this.teamImg = this.playerStat[0].teamImage;
      this.chart?.update();
      });
  }

  calculateStats(): void {
    var calcAB = 0;
    var calcH = 0;
    var calcBB = 0;
    var calcHBP = 0;
    var calcSF = 0;
    var calcTB = 0;
    this.playerStat.forEach(game => {
      calcAB += game.AB;
      calcH += game.H;
      calcBB += game.BB;
      calcHBP += game.HBP;
      calcSF += game.SF;
      calcTB += game.TB;
      this.avg.push((calcH / calcAB)), 
      this.ops.push(((calcAB * (calcH + calcBB + calcHBP) + calcTB * (calcAB + calcBB + calcSF + calcHBP))
      / (calcAB * (calcAB + calcBB + calcSF + calcHBP))));
      this.games.push(game.gameDate.split(" ")[0].split("-")[1]+"/"+game.gameDate.split(" ")[0].split("-")[2]);
    this.calculatedStats.push({"playerId": game.playerId, 
    "fullName": game.fullName,
    "playerImage": game.playerImage,
    "gameDate": game.gameDate,
    "team": game.team,
    "teamImage": game.teamImage,
    "opponent": game.opponent,
    "opponentImage": game.opponentImage,
    "PA": game.PA,
    "AB": game.AB,
    "H": game.H,
    "HR": game.HR,
    "BB": game.BB,
    "K": game.K,
    "HBP": game.HBP,
    "SF": game.SF,
    "TB": game.TB,
    "RBI": game.RBI,
    "avg": (calcH / calcAB).toFixed(3), 
    "ops": ((calcAB * (calcH + calcBB + calcHBP) + calcTB * (calcAB + calcBB + calcSF + calcHBP))
    / (calcAB * (calcAB + calcBB + calcSF + calcHBP))).toFixed(3)});
    });
  }
}